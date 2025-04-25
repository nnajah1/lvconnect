<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\User;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
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
     * For student submitted survey.
     */

    public function submitResponse(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('student')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'survey_id' => 'required|exists:surveys,id',
            'answers' => 'required|array|min:1',
            'answers.*.survey_question_id' => 'required|exists:survey_questions,id',
            'answers.*.answer' => 'nullable|string',
            'answers.*.img_url' => 'nullable|string',
        ]);

        // Prevent duplicate submissions
        $existing = SurveyResponse::where('survey_id', $validated['survey_id'])
            ->where('student_information_id', $user->student_information_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already submitted this survey.'], 409);
        }

        // Create survey response record
        $response = SurveyResponse::create([
            'survey_id' => $validated['survey_id'],
            'student_information_id' => $user->student_information_id,
            'submitted_at' => now(),
        ]);

        // Save each answer
        foreach ($validated['answers'] as $answerData) {
            SurveyAnswer::create([
                'survey_response_id' => $response->id,
                'survey_question_id' => $answerData['survey_question_id'],
                'student_information_id' => $user->student_information_id,
                'answer' => $answerData['answer'] ?? null,
                'img_url' => $answerData['img_url'] ?? null,
            ]);
        }

        return response()->json([
            'message' => 'Survey submitted successfully.',
            'response_id' => $response->id,
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
     * Block all features for Mandatory Survey.
     */
    public function getActiveMandatorySurvey()
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('student')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get IDs of mandatory + visible surveys
        $mandatorySurveyIds = Survey::where('is_visible', true)
            ->where('mandatory', true)
            ->pluck('id');

        // Get submitted surveys by student
        $submittedSurveyIds = SurveyResponse::where('student_information_id', $user->student_information_id)
            ->whereIn('survey_id', $mandatorySurveyIds)
            ->pluck('survey_id');

        // Get one pending mandatory survey
        $pendingSurvey = Survey::with('questions')
            ->whereIn('id', $mandatorySurveyIds->diff($submittedSurveyIds))
            ->first();

        if ($pendingSurvey) {
            return response()->json([
                'must_answer' => true,
                'survey' => $pendingSurvey,
            ], 200);
        }

        return response()->json([
            'must_answer' => false,
            'message' => 'No mandatory surveys pending.',
        ], 200);
    }

    /**
     * Analytics for Dashboard.
     */
    public function analyticsDashboard()
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Count of students
        $totalStudents = User::role('student')->count();

        // Visible and mandatory surveys
        $visibleSurveys = Survey::where('is_visible', true)->count();
        $mandatorySurveys = Survey::where('mandatory', true)->count();

        // Total survey answers submitted
        $totalAnswers = SurveyAnswer::count();

        // How many students answered each survey
        $surveyResponseCounts = Survey::withCount([
            'questions as responses_count' => function ($query) {
                $query->join('survey_answers', 'survey_questions.id', '=', 'survey_answers.survey_question_id');
            }
        ])->get(['id', 'title']);

        return response()->json([
            'total_students' => $totalStudents,
            'visible_surveys' => $visibleSurveys,
            'mandatory_surveys' => $mandatorySurveys,
            'total_answers_submitted' => $totalAnswers,
            'survey_response_counts' => $surveyResponseCounts
        ]);
    }

    /**
     * Analytics for Summary.
     */
    public function analytictsSummary()
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
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
