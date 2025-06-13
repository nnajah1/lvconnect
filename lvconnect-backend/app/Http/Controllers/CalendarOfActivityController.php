<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CalendarOfActivity;
use Tymon\JWTAuth\Facades\JWTAuth;

class CalendarOfActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = JWTAuth::authenticate();

        if ($user->hasActiveRole('student')) {
            return CalendarOfActivity::select('event_title', 'description', 'start_date', 'end_date', 'color')->get();
        }

        if ($user->hasActiveRole('comms')) {
            return CalendarOfActivity::all();
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('comms')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $validated = $request->validate([
                'event_title' => 'required|string|max:255',
                'description' => 'required|string|max:1000',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'color' => 'required|string',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        try {
            $event = CalendarOfActivity::create([
                'event_title' => $validated['event_title'],
                'description' => $validated['description'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'created_by' => $user->id,
                'color' => $validated['color'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create event',
                'error' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Event created successfully',
            'data' => $event,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = JWTAuth::authenticate();

        if (! $user->hasAnyRole(['comms', 'student'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $activity = CalendarOfActivity::select('id','event_title', 'description', 'start_date', 'end_date')->find($id);

        if (!$activity) {
            return response()->json(['message' => 'Activity not found'], 404);
        }

        return response()->json($activity);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('comms')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event = CalendarOfActivity::find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        try {
            $validated = $request->validate([
                'event_title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string|max:1000',
                'start_date' => 'sometimes|required|date',
                'end_date' => 'sometimes|required|date|after_or_equal:start_date',
                'color' => 'required|string',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        if (isset($validated['event_title'])) {
            $event->event_title = $validated['event_title'];
        }

        if (isset($validated['description'])) {
            $event->description = $validated['description'];
        }

        if (isset($validated['start_date'])) {
            $event->start_date = $validated['start_date'];
        }

        if (isset($validated['end_date'])) {
            $event->end_date = $validated['end_date'];
        }

        if (isset($validated['color'])) {
            $event->color = $validated['color'];
        }

        try {
            $event->save();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update event',
                'error' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Event updated successfully',
            'data' => $event,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('comms')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $activity = CalendarOfActivity::find($id);

        if (!$activity) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $activity->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
}
