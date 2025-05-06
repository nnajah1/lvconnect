<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\User;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            return Survey::with('questions')
                ->get();
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    /**
     * Store a newly created survey (by PSAS admin).
     */
    public function storeSurveyWithQuestions(Request $request)
    {
        $user = JWTAuth::authenticate();
    
        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_visible' => 'boolean',
            'mandatory' => 'boolean',
            'questions' => 'required|array',
            'questions.*.type' => 'required|string',
            'questions.*.question' => 'required|string',
            'questions.*.is_required' => 'required|boolean',
            'questions.*.order' => 'required|integer',
            'questions.*.choices' => 'nullable|array',
        ]);
    
        DB::beginTransaction();
        try {
            $survey = Survey::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'created_by' => $user->id,
                'is_visible' => $validated['is_visible'] ?? false,
                'mandatory' => $validated['mandatory'] ?? false,
            ]);
    
            foreach ($validated['questions'] as $q) {
                SurveyQuestion::create([
                    'survey_id' => $survey->id,
                    'survey_question_type' => $q['type'],
                    'question' => $q['question'],
                    'survey_question_data' => json_encode([
                        'choices' => $q['choices'] ?? [],
                        // 'files' => [] 
                    ]),
                    'order' => $q['order'],
                    'is_required' => $q['is_required'] ?? false,
                ]);
            }
    
            DB::commit();
            return response()->json([
                'message' => 'Survey and questions saved successfully.',
                'survey_id' => $survey->id,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to save survey.'], 500);
        }
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $file = $request->file('image');
        $path = $file->store('survey_images', 'public');

        return response()->json([
            'message' => 'Image uploaded successfully',
            'file_path' => $path,
            'url' => Storage::url($path),
        ], 200);
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
    public function updateSurveyWithQuestions(Request $request, $id)
    {
        $user = JWTAuth::authenticate();
    
        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_visible' => 'boolean',
            'mandatory' => 'boolean',
            'questions' => 'required|array',
            'questions.*.id' => 'nullable', 
            'questions.*.type' => 'required|string',
            'questions.*.question' => 'required|string',
            'questions.*.is_required' => 'required|boolean',
            'questions.*.order' => 'required|integer',
            'questions.*.choices' => 'nullable|array',
            // 'questions.*.files' => 'nullable|array',
        ]);
    
        DB::beginTransaction();
        try {
            $survey = Survey::findOrFail($id);
            $survey->update([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'is_visible' => $validated['is_visible'] ?? false,
                'mandatory' => $validated['mandatory'] ?? false,
            ]);
    
            $existingQuestionIds = [];
    
            foreach ($validated['questions'] as $q) {
                // Prepare the question data
                $questionData = [
                    'survey_id' => $survey->id,
                    'survey_question_type' => $q['type'],
                    'question' => $q['question'],
                    'order' => $q['order'],
                    'is_required' => $q['is_required'] ?? false,
                ];
    
                // Prepare the JSON data separately
                $jsonData = [];
                
                // Handle choices for choice-based questions
                if (isset($q['choices']) && is_array($q['choices'])) {
                    $jsonData['choices'] = $q['choices'];
                } else {
                    $jsonData['choices'] = [];
                }
                
                // Add the JSON encoded data
                $questionData['survey_question_data'] = json_encode($jsonData);
    
                if (!empty($q['id'])) {
                    // Update existing question
                    $question = SurveyQuestion::find($q['id']);
                    if ($question) {
                        $question->update($questionData);
                        $existingQuestionIds[] = $question->id;
                    } else {
                        // If ID provided but question not found, create new
                        $question = SurveyQuestion::create($questionData);
                        $existingQuestionIds[] = $question->id;
                    }
                } else {
                    // New question
                    $question = SurveyQuestion::create($questionData);
                    $existingQuestionIds[] = $question->id;
                }
            }
    
            // Delete removed questions
            SurveyQuestion::where('survey_id', $survey->id)
                ->whereNotIn('id', $existingQuestionIds)
                ->delete();
    
            DB::commit();
            return response()->json(['message' => 'Survey updated successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Survey update failed.',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
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
        'answers.*.taken_at' => 'nullable|date',
    ]);

    // Prevent duplicate submissions
    $existing = SurveyResponse::where('survey_id', $validated['survey_id'])
        ->where('student_information_id', $user->student_information_id)
        ->exists();

    if ($existing) {
        return response()->json(['message' => 'You have already submitted this survey.'], 409);
    }

    // Load the survey with questions
    $survey = Survey::with('questions')->findOrFail($validated['survey_id']);
    $answers = collect($validated['answers']);

    // Enforce required answers
    foreach ($survey->questions as $question) {
        if ($question->is_required) {
            $answer = $answers->firstWhere('survey_question_id', $question->id);

            $hasAnswer = $answer && (
                ($question->survey_question_type === 'Upload Photo' && !empty($answer['img_url'])) ||
                (!empty($answer['answer']))
            );

            if (!$hasAnswer) {
                return response()->json([
                    'message' => "Answer is required for question: {$question->question}"
                ], 422);
            }
        }
    }

    // Create survey response
    $response = SurveyResponse::create([
        'survey_id' => $validated['survey_id'],
        'student_information_id' => $user->student_information_id,
        'submitted_at' => now(),
    ]);

    // Save each answer
    foreach ($validated['answers'] as $answerData) {
        SurveyAnswer::create([
            'survey_id' => $validated['survey_id'],
            'survey_question_id' => $answerData['survey_question_id'],
            'student_information_id' => $user->student_information_id,
            'answer' => $answerData['answer'] ?? null,
            'img_url' => $answerData['img_url'] ?? null,
            'taken_at' => $answerData['taken_at'] ?? null,
            'created_at' => now(),
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
