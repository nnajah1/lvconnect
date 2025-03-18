<?php

namespace App\Http\Controllers;

use App\Models\SchoolUpdate;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class SchoolUpdateController extends Controller
{
    /**
     * Get all school update posts, optionally filtered by type (announcement or event)
     */
    public function index(Request $request)
    {
        
        $user = auth()->user();
        
        if ($user->hasRole('student')) {
                return SchoolUpdate::where('status', 'published')->get();
        }
        
        if ($user->hasRole('comms')) {
                return SchoolUpdate::where('user_id', $user->id)->get();
        }
        
        if ($user->hasRole('scadmin')) {
                return SchoolUpdate::where('status', 'pending')->get();
        }
        
        return response()->json(['message' => 'Unauthorized'], 403);
        
    }

    /**
     * Create a new school update post (Communications Officer only)
     */
    public function store(Request $request, SchoolUpdate $schoolupdate)
    {
        
        // Ensure only 'comms' can create a post
    if (!auth()->user()->hasRole('comms')) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'type' => 'required|in:announcement,event',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'file' => 'nullable|mimes:pdf,docx|max:5120',
        ]);
       
        try {

            $imageUrl = null;

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('SchoolUpdates', 'public'); // Save in storage/app/public/SchoolUpdates
                $imageUrl = Storage::url($imagePath); // Generate public URL
            }

            $schoolupdate = SchoolUpdate::create([
                'title' => $request->title,
                'content' => $request->content,
                'type' => $request->type,
                'image_url' => $imageUrl, 
                'created_by' => auth()->id(),
                'status' => SchoolUpdate::STATUS_DRAFT, // Default status is "Draft"
            ]);

            return response()->json(['message' => 'Post created successfully','Post' => $schoolupdate], 201);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create Post'], 500);
        }
    }

    /**
     * Update an existing school update post (Communications Officer only)
     */
    public function update(Request $request, SchoolUpdate $schoolupdate)
    {   
        Gate::authorize('update', $schoolupdate);

            $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required',
            ]);

        try {
            
            $schoolupdate->update([
                'title' => $request->title,
                'content' => $request->content,
            ]);

            return response()->json(['message' => 'Post updated successfully']);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update post'], 500);
        }
    }

    /**
     * Submit school update post for approval (Communications Officer)
     */
    public function submitForApproval(SchoolUpdate $schoolupdate)
    {   
        Gate::authorize('submitForApproval', $schoolupdate);

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
        Gate::authorize('approve', $schoolupdate);

        try {

            $schoolupdate->update([
                'status' => SchoolUpdate::STATUS_APPROVED,
                'approved_by' => auth()->id(),
            ]);

            return response()->json(['message' => 'Post approved successfully']);
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

    public function publish(SchoolUpdate $schoolupdate)
    {   
        Gate::authorize('publish', $schoolupdate);

        try {

            $schoolupdate->update(['status' => SchoolUpdate::STATUS_PUBLISHED]);

            return response()->json(['message' => 'Post published successfully']);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to publish post'], 500);
        }
    }

    public function destroy(SchoolUpdate $schoolUpdate)
    {
        Gate::authorize('delete', $schoolUpdate);
        try {
            Gate::authorize('delete', $schoolUpdate);
            $schoolUpdate->delete();
            return response()->json(['message' => 'Post deleted successfully']);
        } catch (AuthorizationException $e) {
            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong'], 500);
        }
        
    }
}
