<?php

namespace App\Http\Controllers;

use App\Models\SchoolUpdate;
use App\Models\StudentInformation;
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

        if ($user->hasActiveRole('comms')) {
            return SchoolUpdate::where('created_by', $user->id)
                ->where('status', '!=', 'archived')
                ->get();
        }
        if ($user->hasActiveRole('student')) {
            return SchoolUpdate::where('status', SchoolUpdate::STATUS_PUBLISHED)->get();
        }

        if ($user->hasActiveRole('scadmin')) {
            return SchoolUpdate::whereIn('status', [
                SchoolUpdate::STATUS_PENDING,
                SchoolUpdate::STATUS_REJECTED,
                SchoolUpdate::STATUS_PUBLISHED,
                SchoolUpdate::STATUS_SYNCED,
                SchoolUpdate::STATUS_APPROVED,
                SchoolUpdate::STATUS_REVISION
            ])->get();
        }
        
        return response()->json(['message' => 'Unauthorized'], 403);

    }

    public function show($id)
    {
        $user = JWTAuth::authenticate();

        // Handle 'comms' role
        if ($user->hasActiveRole('comms')) {
            $schoolUpdate = SchoolUpdate::where('id', $id)->first();

            if (!$schoolUpdate) {
                return response()->json(['message' => 'Post not found'], 404);
            }

            return response()->json($schoolUpdate);
        }

        // Handle 'scadmin' role
        if ($user->hasActiveRole('scadmin')) {
            $schoolUpdate = SchoolUpdate::where('id', $id)
                ->where('status', '!=', SchoolUpdate::STATUS_DRAFT)
                ->with('author')
                ->first();

            if (!$schoolUpdate) {
                return response()->json(['message' => 'Post not found'], 404);
            }

            return response()->json($schoolUpdate);
        }

        // Fallback for unauthorized roles
        return response()->json(['message' => 'Unauthorized'], 403);
    }




    /**
     * Create a new school update post (Communications Officer only)
     */


    public function store(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasActiveRole('comms')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:announcement,event',
            'image_paths' => 'nullable|array',
            'image_paths.*' => 'string',
            'is_notified' => 'sometimes|boolean',
            'is_urgent' => 'sometimes|boolean',
            'status' => 'required|in:draft,pending,published',
        ]);

        try {

            $content = Purifier::clean($request->content);


            $schoolUpdateData = [
                'title' => $request->title,
                'content' => $content,
                'type' => $request->type,
                'image_url' => $request->image_paths ?? [],
                'created_by' => $user->id,
                'status' => $request->status,
                'is_notified' => $request->boolean('is_notified'),
                'is_urgent' => $request->boolean('is_urgent'),
            ];

            if ($request->status === SchoolUpdate::STATUS_PUBLISHED) {
                $schoolUpdateData['published_at'] = now();
            }

            $schoolUpdate = SchoolUpdate::create($schoolUpdateData);

            // Notify students if post is urgent and published
            // if ($schoolUpdate->is_urgent && $schoolUpdate->status === SchoolUpdate::STATUS_PUBLISHED && $schoolUpdate->is_notified) {
            //     $students = User::role('student')->get();
            //     foreach ($students as $student) {
            //         $student->notify(new PostNotification($schoolUpdate));
            //     }
            // }

            return response()->json([
                'message' => 'Post created successfully',
                'post' => $schoolUpdate,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create Post',
                'trace' => $e->getTraceAsString(),
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Update an existing school update post (Communications Officer only)
     */
    public function update(Request $request, SchoolUpdate $schoolupdate)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasActiveRole(['comms'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Allow update only if post is in draft or revision status
        if (!in_array($schoolupdate->status, [SchoolUpdate::STATUS_DRAFT, SchoolUpdate::STATUS_REVISION])) {
            return response()->json(['error' => 'Only draft or revision posts can be edited'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:announcement,event',
            'image_paths' => 'nullable|array',
            'image_paths.*' => 'string',
            'is_notified' => 'sometimes|boolean',
            'is_urgent' => 'sometimes|boolean',
            'status' => 'required|in:draft,pending,published',
        ]);

        try {
            $content = Purifier::clean($request->content);

            $isUrgent = $request->boolean('is_urgent');
            $finalStatus = $isUrgent ? SchoolUpdate::STATUS_PUBLISHED : $request->status;

            $schoolupdate->update([
                'title' => $request->title,
                'content' => $content,
                'type' => $request->type,
                'image_url' => $request->image_paths ?? [],
                'is_notified' => $request->boolean('is_notified'),
                'is_urgent' => $isUrgent,
                'status' => $finalStatus,
                'published_at' => $finalStatus === SchoolUpdate::STATUS_PUBLISHED ? now() : $schoolupdate->published_at,
            ]);

            // Notify students if published and notified
            // if ($finalStatus === SchoolUpdate::STATUS_PUBLISHED && $schoolupdate->is_notified) {
            //     $comms = new \App\Services\StudentCommService();
            //     $comms->notify(new \App\Notifications\PostNotification($schoolupdate));
            // }    

            return response()->json([
                'message' => 'Post updated successfully',
                'post' => $schoolupdate,
            ]);

        } catch (\Exception $e) {
            \Log::error('Post update failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update post'], 500);
        }
    }


    public function archive(SchoolUpdate $schoolupdate)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasActiveRole('comms')) {
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
        $user = JWTAuth::authenticate();

        if (!$user->hasActiveRole('comms')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($schoolupdate->status !== SchoolUpdate::STATUS_ARCHIVED) {
            return response()->json(['error' => 'Only archived posts can be restored'], 403);
        }

        try {
            $schoolupdate->update(['status' => SchoolUpdate::STATUS_PUBLISHED, 'archived_at' => Carbon::now()]);
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

        if (!$user->hasActiveRole('comms')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return SchoolUpdate::where('created_by', $user->id)
            ->where('status', SchoolUpdate::STATUS_ARCHIVED)
            ->orderBy('created_at', 'desc')
            ->get();
    }


    /**
     * Submit school update post for approval (Communications Officer)
     */
    public function submitForApproval(SchoolUpdate $schoolupdate)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasActiveRole('comms')) {
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
        $user = JWTAuth::authenticate();

        if (!$user->hasActiveRole('scadmin')) {
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
    public function reject(Request $request, SchoolUpdate $schoolupdate)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasActiveRole('scadmin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'revision_remarks' => 'required|string|max:1000',
        ]);
        try {

            $schoolupdate->update([
                'status' => SchoolUpdate::STATUS_REJECTED,
                'revision_remarks' => $request->input('revision_remarks'),
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

        $user = JWTAuth::authenticate();

        if (!$user->hasActiveRole('scadmin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            // 'revision_fields' => 'required|array',
            'revision_remarks' => 'required|string|max:1000',
        ]);

        try {

            $schoolupdate->update([
                'status' => SchoolUpdate::STATUS_REVISION,
                // 'revision_fields' => json_encode($request->revision_fields),
                'revision_remarks' => $request->input('revision_remarks'),
            ]);

            return response()->json(['message' => 'Post moved to revision']);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to request revision'], 500);
        }
    }

    public function publish($id)
    {
        $user = JWTAuth::authenticate();

        $post = SchoolUpdate::findOrFail($id);

        if (!$user->hasActiveRole('comms')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only allow publish from draft or pending
        if (!in_array($post->status, [SchoolUpdate::STATUS_DRAFT, SchoolUpdate::STATUS_PENDING, SchoolUpdate::STATUS_APPROVED,])) {
            return response()->json(['message' => 'Cannot publish this post'], 400);
        }

        $post->status = SchoolUpdate::STATUS_PUBLISHED;
        $post->published_at = now();
        $post->save();

        // Notify users
        // if ($post->is_notified && $post->is_urgent) {
        //     $students = StudentInformation::where('role', 'student')->get();
        //     foreach ($students as $student) {
        //         $student->notify(new PostNotification($post));
        //     }
        // }

        return response()->json(['message' => 'Post published successfully']);
    }

    /**
     * Publish a post to Facebook Page
     */
    // public function publish(SchoolUpdate $schoolupdate, Request $request)
    // {
    //     if (!auth()->user()->hasActiveRole('comms')) {
    //         return response()->json(['error' => 'Unauthorized'], 403);
    //     }

    //     $request->validate([
    //         'post_to_facebook' => 'boolean',
    //     ]);

    //     try {
    //         $postToFacebook = $request->post_to_facebook;

    //         // Update post status to published
    //         $schoolupdate->update([
    //             'status' => SchoolUpdate::STATUS_PUBLISHED,
    //             'post_to_facebook' => $postToFacebook,
    //         ]);

    //         // Check if we should post to Facebook
    //         if ($postToFacebook) {
    //             $pageId = env('FACEBOOK_PAGE_ID');
    //             $accessToken = env('FACEBOOK_ACCESS_TOKEN');
    //             $fbVersion = config('services.facebook.version', 'v18.0');

    //             // Prepare content (strip HTML)
    //             $postMessage = strip_tags($schoolupdate->title . "\n\n" . $schoolupdate->content);

    //             // Prepare request payload
    //             $fbPostData = [
    //                 'message' => $postMessage,
    //                 'access_token' => $accessToken,
    //             ];

    //             // If the post has an image, attach it as a photo post
    //             if (!empty($schoolupdate->image_url)) {
    //                 $fbPostData['url'] = asset($schoolupdate->image_url); // Ensure correct URL format
    //                 $response = Http::post("https://graph.facebook.com/{$fbVersion}/{$pageId}/photos", $fbPostData);
    //             } else {
    //                 // Standard text post
    //                 $response = Http::post("https://graph.facebook.com/{$fbVersion}/{$pageId}/feed", $fbPostData);
    //             }

    //             // $response = Http::post("https://graph.facebook.com/v18.0/{$pageId}/feed", [
    //             //     'message' => $schoolupdate->title . "\n\n" . $schoolupdate->content,
    //             //     'access_token' => $accessToken,
    //             // ]);

    //             if ($response->successful()) {
    //                 $facebookPostId = $response->json()['id'];
    //                 $schoolupdate->update(['facebook_post_id' => $facebookPostId]);

    //                 return response()->json([
    //                     'message' => 'Post published and shared on Facebook!',
    //                     'facebook_post_id' => $facebookPostId,
    //                 ], 200);
    //             } else {
    //                 Log::error('Facebook Post Failed', ['error' => $response->json()]);
    //                 return response()->json([
    //                     'message' => 'Post published, but failed to share on Facebook',
    //                     'error' => $response->json(),
    //                 ], 400);
    //             }
    //         }

    //         return response()->json(['message' => 'Post published successfully!'], 200);

    //     } catch (AuthorizationException $e) {
    //         return response()->json(['error' => 'Unauthorized'], 403);
    //     } catch (\Exception $e) {
    //         Log::error('Failed to publish post', ['exception' => $e->getMessage()]);
    //         return response()->json(['error' => 'Failed to publish post'], 500);
    //     }
    // }

    public function sync(Request $request, $id)
    {
        Log::info('Facebook Sync Request Received', [
            'request_data' => $request->all(),
        ]);

        try {
            $validated = $request->validate([
                'schoolupdate_id' => 'required|exists:school_updates,id',
                'title' => 'required|string',
                'content' => 'required|string',
                'image_url' => 'nullable|array',
            ]);
        } catch (ValidationException $ex) {
            Log::error('Validation failed', [
                'errors' => $ex->errors(),
            ]);
            return response()->json([
                'error' => 'Validation failed',
                'details' => $ex->errors(),
            ], 422);
        }

        try {
            $schoolupdate = SchoolUpdate::findOrFail($id);
            $fbVersion = 'v18.0';
            $pageId = env('FACEBOOK_PAGE_ID');
            $accessToken = env('FACEBOOK_ACCESS_TOKEN');
            $imageUrls = is_array($schoolupdate->image_url)
                ? $schoolupdate->image_url
                : json_decode($schoolupdate->image_url, true) ?? [];

            if (!empty($imageUrls)) {

                $attachedMedia = [];

                foreach ($imageUrls as $path) {
                    $signedUrl = generateSignedUrl($path);

                    $photoResponse = Http::post("https://graph.facebook.com/{$fbVersion}/{$pageId}/photos", [
                        'access_token' => $accessToken,
                        'url' => $signedUrl,
                        'published' => false,
                    ]);

                    if ($photoResponse->successful()) {
                        $mediaId = $photoResponse->json('id');
                        $attachedMedia[] = ['media_fbid' => $mediaId];
                    } else {
                        return response()->json(['error' => $photoResponse->json()], 500);
                    }
                }

                $postData = [
                    'access_token' => $accessToken,
                    'message' => strip_tags($request->content),
                    'attached_media' => $attachedMedia,
                ];


                $postUrl = "https://graph.facebook.com/{$fbVersion}/{$pageId}/feed";
            } else {
                $postData = [
                    'access_token' => $accessToken,
                    'message' => strip_tags($request->content),
                ];

                $postUrl = "https://graph.facebook.com/{$fbVersion}/{$pageId}/feed";
            }

            Log::info('Sending data to Facebook', [
                'url' => $postUrl,
                'postData' => $postData,
            ]);

            $response = Http::post($postUrl, $postData);

            Log::info('Facebook response', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

            if ($response->successful()) {
                $schoolupdate->update([
                    'status' => SchoolUpdate::STATUS_SYNCED,
                    'synced_at' => now(),
                    'facebook_post_id' => $response->json()['id'] ?? null,
                ]);

                return response()->json([
                    'message' => 'Post synced to Facebook successfully!',
                    'fb_response' => $response->json(),
                ]);
            } else {
                return response()->json([
                    'error' => 'Failed to sync with Facebook',
                    'fb_response' => $response->json(),
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Facebook sync error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Facebook sync failed'], 500);
        }
    }


    public function destroy(string $id)
    {
        $user = JWTAuth::authenticate();
        if (!$user->hasActiveRole('comms')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post = SchoolUpdate::findOrFail($id);

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully.']);
    }


}
