<?php

namespace App\Http\Controllers;

use App\Models\SchoolUpdate;
use App\Models\User;
use App\Notifications\UrgentPostNotification;
use App\Notifications\PostApprovedNotification;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
// use Mews\Purifier\Facades\Purifier;
use Mews\Purifier\Facades\Purifier;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

class SchoolUpdateController extends Controller
{
    /**
     * Get all school update posts, optionally filtered by type (announcement or event)
     */
    public function index(Request $request)
    {

        $user = JWTAuth::authenticate();

        if ($user->hasRole('student')) {
            return SchoolUpdate::where('status', SchoolUpdate::STATUS_PUBLISHED)->get();
        }

        if ($user->hasRole('comms')) {
            return SchoolUpdate::where('created_by', $user->id)
                ->where('status', '!=', 'archived')
                ->get();
        }

        if ($user->hasRole('scadmin')) {
            return SchoolUpdate::whereIn('status', SchoolUpdate::STATUS_PENDING, SchoolUpdate::STATUS_REVISION)->get();
        }

        return response()->json(['message' => 'Unauthorized'], 403);

    }

    public function show($id)
    {
        $user = JWTAuth::authenticate();

        if ($user->hasRole('comms')) {
            $schoolUpdate = SchoolUpdate::where('id', $id)
                ->where('created_by', $user->id)
                ->first();
        }

        if (!$schoolUpdate) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json($schoolUpdate);
    }


    /**
     * Create a new school update post (Communications Officer only)
     */
    public function store(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole(['comms'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate request data
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:announcement,event',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_notified' => 'sometimes|boolean',
            'is_urgent' => 'sometimes|boolean',
            'status' => 'required|in:draft,pending',
            'post_to_facebook' => 'sometimes|boolean',

        ]);


        try {
            $imageUrls = [];

            // Upload image files
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('SchoolUpdates', 'public');
                    $imageUrls[] = asset('storage/' . $path); // Use full URL
                }
            }

            // Extract and replace Base64 images with actual URLs
            $content = Purifier::clean($request->content);
            preg_match_all('/<img[^>]+src="data:image\/[^;]+;base64,([^"]+)"[^>]*>/', $content, $matches);

            if (!empty($matches[0])) {
                foreach ($matches[0] as $index => $base64ImageTag) {
                    $imageUrl = $imageUrls[$index] ?? null;
                    if ($imageUrl) {
                        $content = str_replace($base64ImageTag, '<img src="' . $imageUrl . '" />', $content);
                    }
                }
            }

            $status = $request->status === 'pending' && $request->boolean('is_urgent')
                ? SchoolUpdate::STATUS_PUBLISHED
                : ($request->status === 'draft'
                    ? SchoolUpdate::STATUS_DRAFT
                    : SchoolUpdate::STATUS_PENDING);

            // Create the post
            $schoolUpdate = SchoolUpdate::create([
                'title' => $request->title,
                'content' => $content,
                'type' => $request->type,
                'image_url' => $imageUrls ? json_encode($imageUrls) : null,
                'created_by' => $user->id,
                'status' => $status,
                'is_notified' => $request->boolean('is_notified'),
                'is_urgent' => $request->boolean('is_urgent'),
                'post_to_facebook' => $request->boolean('post_to_facebook'),
            ]);

            // if ($schoolUpdate->status === SchoolUpdate::STATUS_PUBLISHED && $schoolUpdate->is_notified) {
            //     $students = User::where('role', 'student')->get();

            //     foreach ($students as $student) {
            //         $student->notify(new PostNotification($schoolUpdate));
            //     }
            // }

            return response()->json([
                'message' => 'Post created successfully',
                'post' => $schoolUpdate
            ], 201);

        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Failed to create Post', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to create Post', 'trace' => $e->getTraceAsString(), 'message' => $e->getMessage(),], 500);
        }
    }
    public function uploadImages(Request $request)
    {
        // Validate the uploaded images
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imageUrls = [];

        try {

            // If a single file is uploaded, Laravel might not treat it as an array, so normalize it
            $images = is_array($request->file('images')) ? $request->file('images') : [$request->file('images')];

            // Process each image
            foreach ($images as $image) {
                $imagePath = $image->store('SchoolUpdates', 'public');  // Store the image
                $imageUrls[] = Storage::url($imagePath);  // Store URL of uploaded image
            }

            // Return the URLs of the uploaded images
            return response()->json(['image_urls' => $imageUrls], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Image upload failed'], 500);
        }
    }


    /**
     * Update an existing school update post (Communications Officer only)
     */
    public function update(Request $request, SchoolUpdate $schoolupdate)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole(['comms'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only allow update if current status is draft or revision
        if (!in_array($schoolupdate->status, [SchoolUpdate::STATUS_DRAFT, SchoolUpdate::STATUS_REVISION])) {
            return response()->json(['error' => 'Only draft or revision posts can be edited'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:announcement,event',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_notified' => 'sometimes|boolean',
            'is_urgent' => 'sometimes|boolean',
            'status' => 'required|in:draft,pending,published',
            'post_to_facebook' => 'sometimes|boolean',
        ]);

        try {
            $imageUrls = json_decode($schoolupdate->image_url ?? '[]', true);

            if ($request->hasFile('images')) {
                $imageUrls = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('SchoolUpdates', 'public');
                    $imageUrls[] = asset('storage/' . $path);
                }
            }

            // Replace base64 images in content
            $content = Purifier::clean($request->content);
            preg_match_all('/<img[^>]+src="data:image\/[^;]+;base64,([^"]+)"[^>]*>/', $content, $matches);

            if (!empty($matches[0])) {
                foreach ($matches[0] as $index => $base64ImageTag) {
                    $imageUrl = $imageUrls[$index] ?? null;
                    if ($imageUrl) {
                        $content = str_replace($base64ImageTag, '<img src="' . $imageUrl . '" />', $content);
                    }
                }
            }

            $isUrgent = $request->boolean('is_urgent');
            $finalStatus = $isUrgent ? SchoolUpdate::STATUS_PUBLISHED : $request->status;

            $schoolupdate->update([
                'title' => $request->title,
                'content' => $content,
                'type' => $request->type,
                'image_url' => $imageUrls ? json_encode($imageUrls) : null,
                'is_notified' => $request->boolean('is_notified'),
                'is_urgent' => $isUrgent,
                'status' => $finalStatus,
                'post_to_facebook' => $request->boolean('post_to_facebook'),
            ]);

            // //Notify students if published and notified
            // if ($finalStatus === SchoolUpdate::STATUS_PUBLISHED && $schoolupdate->is_notified) {
            //     $comms = new \App\Services\StudentCommService(); // or inject it
            //     $comms->notify(new \App\Notifications\PostNotification($schoolupdate));
            // }

            // // Facebook sync logic (if needed)
            // if ($finalStatus === SchoolUpdate::STATUS_PUBLISHED && $schoolupdate->post_to_facebook) {
            //     dispatch(new \App\Jobs\SyncToFacebookJob($schoolupdate));
            // }

            return response()->json(['message' => 'Post updated successfully', 'post' => $schoolupdate]);

        } catch (\Exception $e) {
            \Log::error('Post update failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update post'], 500);
        }
    }


    public function archive(SchoolUpdate $schoolupdate)
    {
        if (!auth()->user()->hasRole('comms')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        if ($schoolupdate->status !== SchoolUpdate::STATUS_PUBLISHED) {
            return response()->json(['error' => 'Only published posts can be archived'], 403);
        }

        try {
            $schoolupdate->update([
                'status' => SchoolUpdate::STATUS_ARCHIVED,
                'archived_at' => Carbon::now()
            ]);
            return response()->json(['message' => 'Post archived successfully']);

        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to archive post'], 500);
        }
    }

    public function restore(SchoolUpdate $schoolupdate)
    {
        if (!auth()->user()->hasRole('comms')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($schoolupdate->status !== SchoolUpdate::STATUS_ARCHIVED) {
            return response()->json(['error' => 'Only archived posts can be restored'], 403);
        }

        try {
            $schoolupdate->update(['status' => SchoolUpdate::STATUS_DRAFT, 'archived_at' => null]);
            return response()->json(['message' => 'Post restored successfully']);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to restore post'], 500);
        }
    }

    public function archivedPosts(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('comms')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return SchoolUpdate::where('created_by', $user->id)
            ->where('status', SchoolUpdate::STATUS_ARCHIVED)
            ->get();

    }

    /**
     * Submit school update post for approval (Communications Officer)
     */
    public function submitForApproval(SchoolUpdate $schoolupdate)
    {
        if (!auth()->user()->hasRole('comms')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {

            $schoolupdate->update(['status' => SchoolUpdate::STATUS_PENDING]);

            return response()->json(['message' => 'Post submitted for approval']);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to submit for approval'], 500);
        }
    }

    /**
     * Approve school update post (School Admin)
     */
    public function approve(SchoolUpdate $schoolupdate)
    {
        if (!auth()->user()->hasRole('scadmin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            // Update post status to approved
            $schoolupdate->update([
                'status' => SchoolUpdate::STATUS_APPROVED,
                'approved_by' => auth()->id(),
                'rejected_at' => null,
            ]);

            // Notify the Communications Officer
            $commsOfficer = $schoolupdate->author;

            if ($commsOfficer) {
                $commsOfficer->notify(new PostApprovedNotification($schoolupdate));
            }

            return response()->json(['message' => 'Post approved successfully. Notification sent to the system and email.']);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to approve Post'], 500);
        }
    }


    /**
     * Reject school update post (School Admin)
     */
    public function reject(SchoolUpdate $schoolupdate)
    {
        Gate::authorize('reject', $schoolupdate);

        try {

            $schoolupdate->update([
                'status' => SchoolUpdate::STATUS_REJECTED,
                'rejected_at' => Carbon::now(),
            ]);

            return response()->json(['message' => 'Post rejected']);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to reject Post'], 500);
        }
    }

    /**
     * Request a revision on a school update post (School Admin)
     */
    public function requestRevision(Request $request, SchoolUpdate $schoolupdate)
    {

        Gate::authorize('requestRevision', $schoolupdate);

        $request->validate([
            'revision_fields' => 'required|array',
            'revision_remarks' => 'nullable|string|max:1000',
        ]);

        try {

            $schoolupdate->update([
                'status' => SchoolUpdate::STATUS_REVISION,
                'revision_fields' => json_encode($request->revision_fields),
                'revision_remarks' => $request->revision_remarks,
            ]);

            return response()->json(['message' => 'Post moved to revision']);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to request revision'], 500);
        }
    }

    /**
     * Publish a post to Facebook Page
     */
    public function publish(SchoolUpdate $schoolupdate, Request $request)
    {
        if (!auth()->user()->hasRole('comms')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'post_to_facebook' => 'boolean',
        ]);

        try {
            $postToFacebook = $request->post_to_facebook;

            // Update post status to published
            $schoolupdate->update([
                'status' => SchoolUpdate::STATUS_PUBLISHED,
                'post_to_facebook' => $postToFacebook,
            ]);

            // Check if we should post to Facebook
            if ($postToFacebook) {
                $pageId = env('FACEBOOK_PAGE_ID');
                $accessToken = env('FACEBOOK_ACCESS_TOKEN');
                $fbVersion = config('services.facebook.version', 'v18.0');

                // Prepare content (strip HTML)
                $postMessage = strip_tags($schoolupdate->title . "\n\n" . $schoolupdate->content);

                // Prepare request payload
                $fbPostData = [
                    'message' => $postMessage,
                    'access_token' => $accessToken,
                ];

                // If the post has an image, attach it as a photo post
                if (!empty($schoolupdate->image_url)) {
                    $fbPostData['url'] = asset($schoolupdate->image_url); // Ensure correct URL format
                    $response = Http::post("https://graph.facebook.com/{$fbVersion}/{$pageId}/photos", $fbPostData);
                } else {
                    // Standard text post
                    $response = Http::post("https://graph.facebook.com/{$fbVersion}/{$pageId}/feed", $fbPostData);
                }

                // $response = Http::post("https://graph.facebook.com/v18.0/{$pageId}/feed", [
                //     'message' => $schoolupdate->title . "\n\n" . $schoolupdate->content,
                //     'access_token' => $accessToken,
                // ]);

                if ($response->successful()) {
                    $facebookPostId = $response->json()['id'];
                    $schoolupdate->update(['facebook_post_id' => $facebookPostId]);

                    return response()->json([
                        'message' => 'Post published and shared on Facebook!',
                        'facebook_post_id' => $facebookPostId,
                    ], 200);
                } else {
                    Log::error('Facebook Post Failed', ['error' => $response->json()]);
                    return response()->json([
                        'message' => 'Post published, but failed to share on Facebook',
                        'error' => $response->json(),
                    ], 400);
                }
            }

            return response()->json(['message' => 'Post published successfully!'], 200);

        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            Log::error('Failed to publish post', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to publish post'], 500);
        }
    }

    public function sync(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'image_url' => 'nullable|array',
        ]);

        try {
            $facebookData = [
                'message' => strip_tags($request->content), // Remove HTML
                'link' => 'https://yourwebsite.com/posts/' . $request->title,
            ];

            if (!empty($request->image_url)) {
                $facebookData['picture'] = $request->image_url[0]; // Use first image
            }

            // Example: Send to Facebook API (Replace with actual API call)
            $response = Http::post("https://graph.facebook.com/{page_id}/feed", [
                'access_token' => env('FACEBOOK_ACCESS_TOKEN'),
                'message' => $facebookData['message'],
                'link' => $facebookData['link'],
                'picture' => $facebookData['picture'] ?? null,
            ]);

            return response()->json([
                'message' => 'Post synced to Facebook successfully!',
                'fb_response' => $response->json(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Facebook sync failed'], 500);
        }
    }


    public function destroy(SchoolUpdate $schoolUpdate)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole(['comms'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        try {
            $schoolUpdate->delete();
            return response()->json(['message' => 'Post deleted successfully']);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong'], 500);
        }

    }
}
