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

        if ($user->hasRole('student')) {
            return CalendarOfActivity::select('event_title', 'description', 'start_date', 'end_date', 'color')->get();
        }

        if ($user->hasRole('comms')) {
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

        $request->validate([
            'event_title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'color' => 'required|string',
        ]);

        $activity = CalendarOfActivity::create([
            'event_title' => $request->event_title,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'created_by' => $user->id,
            'color' => $request->color,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Activity created successfully',
            'data' => $activity,
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

        $activity = CalendarOfActivity::select('event_title', 'description', 'start_date', 'end_date')->find($id);

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

        $activity = CalendarOfActivity::find($id);

        if (!$activity) {
            return response()->json(['message' => 'Activity not found'], 404);
        }

        $request->validate([
            'event_title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:1000',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'color' => 'required|string',
        ]);

        if ($request->has('event_title')) {
            $activity->event_title = $request->event_title;
        }

        if ($request->has('description')) {
            $activity->description = $request->description;
        }

        if ($request->has('start_date')) {
            $activity->start_date = $request->start_date;
        }

        if ($request->has('end_date')) {
            $activity->end_date = $request->end_date;
        }
         if ($request->has('color')) {
            $activity->color = $request->color;
        }

        $activity->save();

        return response()->json([
            'success' => true,
            'message' => 'Activity updated successfully',
            'data' => $activity,
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
            return response()->json(['message' => 'Activity not found'], 404);
        }

        $activity->delete();

        return response()->json(['message' => 'Activity deleted successfully']);
    }
}
