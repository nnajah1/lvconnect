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

        if ($user->hasRole('student')) {
            return SchoolUpdate::where('status', SchoolUpdate::STATUS_PUBLISHED)->get();
        }

        if ($user->hasRole('comms')) {
            return SchoolUpdate::where('created_by', $user->id)
                ->where('status', '!=', 'archived')
                ->get();
        }

        if ($user->hasRole('scadmin')) {
            return SchoolUpdate::whereIn('status', [
                SchoolUpdate::STATUS_PENDING,
                SchoolUpdate::STATUS_REJECTED,
                SchoolUpdate::STATUS_PUBLISHED,
                SchoolUpdate::STATUS_SYNCED,
                SchoolUpdate::STATUS_APPROVED
            ])->get();
        }

        return response()->json(['message' => 'Unauthorized'], 403);

    }

    public function show($id)
    {
        $user = JWTAuth::authenticate();

        $schoolUpdate = null;

        if ($user->hasRole('comms')) {
            $schoolUpdate = SchoolUpdate::where('id', $id)
                ->where('created_by', $user->id)
                ->first();
        }

        if ($user->hasRole('scadmin')) {
            $schoolUpdate = SchoolUpdate::where('id', $id)
                ->whereIn('status', [
                    SchoolUpdate::STATUS_PENDING,
                    SchoolUpdate::STATUS_REJECTED,
                    SchoolUpdate::STATUS_PUBLISHED,
                    SchoolUpdate::STATUS_SYNCED,
                    SchoolUpdate::STATUS_APPROVED
                ])
                ->with('author') 
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

        if (!$user->hasRole('comms')) {
            return response()->json(['message' => 'Unauthorized'], 403);
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
        ]);

        try {
            $imageUrls = [];
            $content = $request->content;

            // Upload images first
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('SchoolUpdates', 'public');
                    $imageUrls[] = Storage::url($path);
                }
            }

            // Clean content and replace base64 images with actual URLs
            $content = Purifier::clean($content);

            // Find all base64 images in content
            preg_match_all('/<img[^>]+src=["\']data:image\/[^"\']+;base64,[^"\']+["\'][^>]*>/i', $content, $matches);

            if (!empty($matches[0]) && !empty($imageUrls)) {
                // Replace base64 images with uploaded URLs
                foreach ($matches[0] as $index => $base64ImageTag) {
                    if (isset($imageUrls[$index])) {
                        // Extract any additional attributes from the original img tag
                        preg_match('/class=["\']([^"\']*)["\']/', $base64ImageTag, $classMatch);
                        $classAttr = !empty($classMatch[1]) ? ' class="' . $classMatch[1] . '"' : '';

                        $newImageTag = '<img src="' . $imageUrls[$index] . '"' . $classAttr . ' />';
                        $content = str_replace($base64ImageTag, $newImageTag, $content);
                    }
                }
            }

            $status = $request->status;

            $schoolUpdateData = [
                'title' => $request->title,
                'content' => $content,
                'type' => $request->type,
                'image_url' => !empty($imageUrls) ? json_encode($imageUrls) : null,
                'created_by' => $user->id,
                'status' => $status,
                'is_notified' => $request->boolean('is_notified'),
                'is_urgent' => $request->boolean('is_urgent'),
            ];

            if ($status === SchoolUpdate::STATUS_PUBLISHED) {
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
            'existing_images' => 'nullable|string', // JSON string of existing image URLs
            'is_notified' => 'sometimes|boolean',
            'is_urgent' => 'sometimes|boolean',
            'status' => 'required|in:draft,pending,published',
        ]);

        try {
            // Start with existing images
            $existingImages = json_decode($request->input('existing_images', '[]'), true);
            $existingImages = is_array($existingImages) ? $existingImages : [];

            $newImageUrls = [];
            $content = $request->content;

            // Upload new images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('SchoolUpdates', 'public');
                    $newImageUrls[] = Storage::url($path);
                }
            }

            // Combine existing and new images
            $allImageUrls = array_merge($existingImages, $newImageUrls);

            // Clean content and replace base64 images with actual URLs
            $content = Purifier::clean($content);

            // Find all base64 images in content
            preg_match_all('/<img[^>]+src=["\']data:image\/[^"\']+;base64,[^"\']+["\'][^>]*>/i', $content, $matches);

            if (!empty($matches[0]) && !empty($newImageUrls)) {
                // Replace base64 images with newly uploaded URLs
                $newImageIndex = 0;
                foreach ($matches[0] as $base64ImageTag) {
                    if (isset($newImageUrls[$newImageIndex])) {
                        // Extract any additional attributes from the original img tag
                        preg_match('/class=["\']([^"\']*)["\']/', $base64ImageTag, $classMatch);
                        $classAttr = !empty($classMatch[1]) ? ' class="' . $classMatch[1] . '"' : '';

                        $newImageTag = '<img src="' . $newImageUrls[$newImageIndex] . '"' . $classAttr . ' />';
                        $content = str_replace($base64ImageTag, $newImageTag, $content);
                        $newImageIndex++;
                    }
                }
            }

            $isUrgent = $request->boolean('is_urgent');
            $finalStatus = $isUrgent ? SchoolUpdate::STATUS_PUBLISHED : $request->status;

            $schoolupdate->update([
                'title' => $request->title,
                'content' => $content,
                'type' => $request->type,
                'image_url' => !empty($allImageUrls) ? json_encode($allImageUrls) : null,
                'is_notified' => $request->boolean('is_notified'),
                'is_urgent' => $isUrgent,
                'status' => $finalStatus,
            ]);

            // Notify students if published and notified
            // if ($finalStatus === SchoolUpdate::STATUS_PUBLISHED && $schoolupdate->is_notified) {
            //     $comms = new \App\Services\StudentCommService();
            //     $comms->notify(new \App\Notifications\PostNotification($schoolupdate));
            // }

            return response()->json(['message' => 'Post updated successfully', 'post' => $schoolupdate]);

        } catch (\Exception $e) {
            \Log::error('Post update failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update post'], 500);
        }
    }


    public function archive(SchoolUpdate $schoolupdate)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('comms')) {
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

        if (!$user->hasRole('comms')) {
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

        if (!$user->hasRole('comms')) {
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

        if (!$user->hasRole('comms')) {
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

        if (!$user->hasRole('scadmin')) {
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

        if (!$user->hasRole('scadmin')) {
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

        if (!$user->hasRole('scadmin')) {
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

        if (!$user->hasRole('comms')) {
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
    //     if (!auth()->user()->hasRole('comms')) {
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

    public function sync(Request $request)
    {
        $request->validate([
            'schoolupdate_id' => 'required|exists:school_updates,id',
            'title' => 'required|string',
            'content' => 'required|string',
            'image_url' => 'nullable|array',
        ]);

        try {
            $schoolupdate = SchoolUpdate::findOrFail($request->schoolupdate_id);

            $facebookData = [
                'message' => strip_tags($request->content),
                'link' => url('/posts/' . urlencode($request->title)),
            ];

            $postData = [
                'access_token' => env('FACEBOOK_ACCESS_TOKEN'),
                'message' => $facebookData['message'],
                'link' => $facebookData['link'],
            ];

            if (!empty($request->image_url)) {
                $postData['picture'] = $request->image_url[0];
            }

            $pageId = env('FACEBOOK_PAGE_ID');
            $fbVersion = 'v18.0';

            $response = Http::post("https://graph.facebook.com/{$fbVersion}/{$pageId}/feed", $postData);

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
            \Log::error('Facebook sync error: ' . $e->getMessage());
            return response()->json(['error' => 'Facebook sync failed'], 500);
        }
    }


    public function destroy(string $id)
    {
        $user = JWTAuth::authenticate();
        $post = SchoolUpdate::findOrFail($id);

        if (!$user->hasRole('comms')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully.']);
    }


}
