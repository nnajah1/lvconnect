<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class SurveyController extends Controller
{
    /**
     * Display a listing of all surveys.
     */
    public function index(Request $request)
    {
        $user = JWTAuth::authenticate();

        if ($user->hasRole('student')) {
            // Students can only see visible surveys
            return Survey::with('questions')
                ->where('is_visible', true)
                ->get();
        }

        if ($user->hasRole('psas')) {
            // PSAS admin can see all surveys
            return Survey::with('questions')->get();
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    /**
     * Store a newly created survey (by PSAS admin).
     */
    public function store(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_visible' => 'boolean',
            'mandatory' => 'boolean',
        ]);

        $survey = Survey::create([
            'title' => $request->title,
            'description' => $request->description,
            'created_by' => $user->id,
            'is_visible' => $request->is_visible ?? false,
            'mandatory' => $request->mandatory ?? false,
        ]);

        return response()->json([
            'message' => 'Survey created successfully.',
            'survey' => $survey
        ]);
    }

    /**
     * Display the specified survey with questions.
     */
    public function show(string $id)
    {
        $user = JWTAuth::authenticate();
        $survey = Survey::with('questions')->findOrFail($id);

        if ($user->hasRole('student') && !$survey->is_visible) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // PSAS can access all surveys now — no need to restrict by created_by
        return response()->json($survey);
    }

    /**
     * Update the specified survey.
     */
    public function update(Request $request, string $id)
    {
        $user = JWTAuth::authenticate();
        $survey = Survey::findOrFail($id);

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_visible' => 'boolean',
            'mandatory' => 'boolean',
        ]);

        $survey->update($request->only([
            'title', 'description', 'is_visible', 'mandatory'
        ]));

        return response()->json([
            'message' => 'Survey updated successfully.',
            'survey' => $survey
        ]);
    }

    /**
     * Toggle the visibility of a survey.
     */
    public function toggleVisibility(string $id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $survey = Survey::findOrFail($id);
        $survey->is_visible = !$survey->is_visible;
        $survey->save();

        return response()->json([
            'message' => 'Survey visibility updated successfully.',
            'survey_id' => $survey->id,
            'new_visibility' => $survey->is_visible
        ]);
    }


    /**
     * Remove the specified survey from storage.
     */
    public function destroy(string $id)
    {
        $user = JWTAuth::authenticate();
        $survey = Survey::findOrFail($id);

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $survey->delete();

        return response()->json(['message' => 'Survey deleted successfully.']);
    }
}
