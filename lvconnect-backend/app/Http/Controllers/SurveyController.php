<?php

namespace App\Http\Controllers;

use App\Models\StudentInformation;
use App\Models\Survey;
use App\Models\User;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Notifications\MandatorySurveyNotification;

class SurveyController extends Controller
{
    /**
     * Display a listing of all surveys.
     */
    public function index(Request $request)
    {
        $user = JWTAuth::authenticate();

        $surveys = collect(); // Start with an empty collection

        // Check if the user has the 'student' role
        if ($user->hasRole('student')) {
            $student = $user->studentInformation;

            if (!$student) {
                return response()->json(['error' => 'Student information not found'], 404);
            }

            // Get all visible surveys
            $studentSurveys = Survey::with('questions')
                ->whereIn('visibility_mode', ['optional', 'mandatory'])
                ->get();

            // Get survey IDs the student has completed
            $completed = $student->surveys()->pluck('survey_student.completed_at', 'survey_id');

            // Merge completion status into each survey
            $studentSurveys->each(function ($survey) use ($completed) {
                $survey->completed_at = $completed[$survey->id] ?? null;
            });

            $surveys = $surveys->merge($studentSurveys);
        }

        // Check if the user has the 'psas' role
        if ($user->hasAnyRole(['psas', 'superadmin'])) {
            $psasSurveys = Survey::with('questions')
                ->orderBy('updated_at', 'desc')
                ->get();

            $surveys = $surveys->merge($psasSurveys);
        }

        if ($surveys->isEmpty()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Remove duplicates if any (optional)
        $surveys = $surveys->unique('id')->values();

        return response()->json($surveys);
    }


    public function getSurveyResponses($surveyId)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasAnyRole(['psas', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $responses = SurveyResponse::with([
            'student',
            'answers.question'
        ])
            ->where('survey_id', $surveyId)
            ->whereHas('student.surveys', function ($q) use ($surveyId) {
                $q->where('survey_id', $surveyId)
                    ->whereNotNull('survey_student.completed_at');
            })
            ->orderBy('submitted_at', 'desc')
            ->get();

        if ($responses->isEmpty()) {
            return response()->json(['message' => 'No completed responses found'], 404);
        }

        $formatted = $responses->map(function ($response) {
            return [
                'id' => $response->student->id,
                'name' => $response->student->full_name,
                'course' => $response->student->program,
                'year' => $response->student->year_level,
                'submitted_at' => $response->submitted_at,

            ];
        });

        return response()->json($formatted);
    }


    public function checkSubmission($surveyId)
    {
        $user = JWTAuth::authenticate();
        $studentInformationId = $user->studentInformation->id;
        $submission = SurveyResponse::where('survey_id', $surveyId)
            ->where('student_information_id', $studentInformationId)
            ->first();

        if ($submission) {
            return response()->json([
                'submitted' => true,
                'submitted_at' => $submission->submitted_at,
            ]);
        }

        return response()->json([
            'submitted' => false,
            'submitted_at' => null,
        ]);
    }


    /**
     * Display the submitted survey responses for student.
     */
    public function getSurveyResponse($surveyId)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasAnyRole(['student', 'psas', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Determine student_information_id
        $studentInformationId = $user->studentInformation->id;

        // If user is psas, allow fetching any student's response
        if ($user->hasAnyRole('psas') && request()->has('student_id')) {
            $studentInformationId = request()->input('student_id');
        }

        // Find the survey response
        $response = SurveyResponse::where('survey_id', $surveyId)
            ->where('student_information_id', $studentInformationId)
            ->first();

        if (!$response) {
            return response()->json([
                'message' => 'No responses found for this survey.',
                'answers' => []
            ], 404);
        }

        // Load answers
        $answers = SurveyAnswer::where('survey_response_id', $response->id)->get();

        if ($answers->isEmpty()) {
            return response()->json([
                'message' => 'No answers found for this survey response.',
                'answers' => []
            ], 404);
        }

        // Format answers
        $formattedAnswers = $answers->map(function ($answer) {
            return [
                'survey_question_id' => $answer->survey_question_id,
                'answer' => $answer->answer,
               'img_url' => $answer->img_url ? generateSignedUrl($answer->img_url) : null,
                'taken_at' => $answer->taken_at,
                'created_at' => $answer->created_at,
            ];
        });

        return response()->json([
            'message' => 'Survey response found.',
            'response_id' => $response->id,
            'answers' => $formattedAnswers,
        ]);
    }


    /**
     * Display the submitted survey responses for admin.
     */
    public function getSubmittedSurveyResponseWithQuestions($surveyResponseId)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasAnyRole(['psas', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Fetch a single submitted survey response with answers and related questions
        $response = SurveyResponse::with([
            'student',
            'answers.question',
            'survey'
        ])
            ->where('id', $surveyResponseId)
            ->whereNotNull('submitted_at')
            ->first();

        if (!$response) {
            return response()->json(['message' => 'Submitted survey response not found.'], 404);
        }

        // Format the response
        $formatted = [
            'survey_response_id' => $response->id,
            'survey' => [
                'id' => $response->survey_id,
                'title' => $response->survey->title,
                'description' => $response->survey->description,
            ],
            'student' => [
                'id' => $response->student->id,
                'name' => $response->student->full_name,
                'course' => $response->student->program,
                'year' => $response->student->year_level,
            ],
            'submitted_at' => $response->submitted_at,
            'answers' => $response->answers->map(function ($answer) {
                return [
                    'question' => [
                        'id' => $answer->question->id,
                        'question_data' => $answer->question->question,
                        'type' => $answer->question->survey_question_type,
                    ],
                    'answer' => $answer->answer,
                    'img_url' => $answer->img_url,
                ];
            }),
        ];

        return response()->json($formatted);
    }
    /**
     * Display the specified survey with questions.
     */
    public function show(string $id)
    {
        $user = JWTAuth::authenticate();
        $survey = Survey::with('questions')->findOrFail($id);

        if ($user->hasAnyRole('student') && !$user->hasAnyRole('psas')) {
            if (in_array($survey->visibility_mode, ['hidden'])) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        return response()->json($survey);
    }

    /**
     * Store a newly created survey (by PSAS admin).
     */
    public function storeSurveyWithQuestions(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasAnyRole(['psas', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'visibility_mode' => 'required|in:hidden,optional,mandatory',
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
                'visibility_mode' => $validated['visibility_mode'],
            ]);

            foreach ($validated['questions'] as $q) {
                SurveyQuestion::create([
                    'survey_id' => $survey->id,
                    'survey_question_type' => $q['type'],
                    'question' => $q['question'],
                    'survey_question_data' => [
                        'choices' => $q['choices'] ?? [],
                    ],
                    'order' => $q['order'],
                    'is_required' => $q['is_required'] ?? false,
                ]);
            }

            // Notify students if survey is mandatory
            if ($survey->visibility_mode === 'mandatory') {
                $students = User::where('role', 'student')->get();
                foreach ($students as $student) {
                    $student->notify(new MandatorySurveyNotification($survey));
                }
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

    /**
     * Update the specified survey.
     */
    public function updateSurveyWithQuestions(Request $request, $id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasAnyRole(['psas', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'visibility_mode' => 'required|in:hidden,optional,mandatory',
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
            $survey = Survey::where('id', $id)->firstOrFail();

            $survey->update([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'visibility_mode' => $validated['visibility_mode'],
            ]);

            $existingQuestionIds = [];

            foreach ($validated['questions'] as $q) {
                // Prepare the question data
                $questionData = [
                    'survey_id' => $survey->id,
                    'survey_question_type' => $q['type'],
                    'question' => $q['question'],
                    'order' => $q['order'],
                    'is_required' => $q['is_required'],
                    'survey_question_data' => [
                        'choices' => $q['choices'] ?? [],
                    ],
                ];

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

            // Send notification if visibility is mandatory
            if ($survey->visibility_mode === 'mandatory') {
                $students = User::role('student')->get(); // use spatie
                foreach ($students as $student) {
                    $student->notify(new MandatorySurveyNotification($survey));
                }
            }

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

        if (!$user->hasAnyRole('student')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'survey_id' => 'required|exists:surveys,id',
            'answers' => 'required|array|min:1',
            'answers.*.survey_question_id' => 'required|exists:survey_questions,id',
            'answers.*.answer' => 'nullable',
            'answers.*.img_url' => 'nullable|string',
            'answers.*.taken_at' => 'nullable|date',
        ]);
        $studentInformationId = $user->studentInformation->id;
        // Prevent duplicate submissions
        $existing = SurveyResponse::where('survey_id', $validated['survey_id'])
            ->where('student_information_id', operator: $studentInformationId)
            ->exists();

        if ($existing) {
            return response()->json(['message' => 'You have already submitted this survey.'], 409);
        }

        // Load the survey with questions
        $survey = Survey::with('questions')->findOrFail($validated['survey_id']);
        $answers = collect($validated['answers']);

        // Enforce required answers
        foreach ($survey->questions as $question) {
            $answer = $answers->firstWhere('survey_question_id', $question->id);
            $value = $answer['answer'] ?? null;
            $imgUrl = $answer['img_url'] ?? null;

            // Required check
            if ($question->is_required) {
                $hasAnswer = $question->survey_question_type === 'Upload Photo'
                    ? !empty($imgUrl)
                    : !empty($value);

                if (!$hasAnswer) {
                    return response()->json([
                        'message' => "Answer is required for question: {$question->question}"
                    ], 422);
                }
            }

            // Per-type validation
            if ($question->survey_question_type === 'Checkboxes') {
                if (!is_array($value)) {
                    return response()->json([
                        'message' => "Answer for question '{$question->question}' must be an array."
                    ], 422);
                }
            } elseif ($question->survey_question_type !== 'Upload Photo') {
                if (!is_string($value) && $value !== null) {
                    return response()->json([
                        'message' => "Answer for question '{$question->question}' must be a string."
                    ], 422);
                }
            }
        }
        $student = $user->studentInformation;

        if (!$student) {
            return response()->json(['message' => 'Student information not found.'], 404);
        }

        // Create survey response
        $response = SurveyResponse::create([
            'survey_id' => $validated['survey_id'],
            'student_information_id' => $student->id,
            'submitted_at' => now(),
        ]);

        // Save each answer
        foreach ($validated['answers'] as $answerData) {
            $answerValue = isset($answerData['answer']) ?
                (is_array($answerData['answer']) ? json_encode($answerData['answer']) : $answerData['answer']) :
                null;

            $takenAt = null;
            if (!empty($answerData['taken_at'])) {
                try {
                    // Convert ISO 8601 format to MySQL datetime format
                    $takenAt = Carbon::parse($answerData['taken_at'])->format('Y-m-d H:i:s');
                } catch (\Exception $e) {
                    $takenAt = now()->format('Y-m-d H:i:s');
                }
            }

            SurveyAnswer::create([
                'survey_response_id' => $response->id,
                'survey_question_id' => $answerData['survey_question_id'],
                'answer' => $answerValue,
                'img_url' => $answerData['img_url'] ?? null,
                'taken_at' => $takenAt,
                'created_at' => now(),
            ]);
        }
        $user->studentInformation->surveys()->syncWithoutDetaching([
            $validated['survey_id'] => []
        ]);
        $user->studentInformation->surveys()->updateExistingPivot($validated['survey_id'], [
            'completed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Survey submitted successfully.',
            'response_id' => $response->id,
        ]);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $file = $request->file('image');
        $path = $file->store('survey_images', 'public');
        $url = Storage::url($path);

        if (!str_starts_with($url, 'http')) {
            $url = url($url);
        }

        return response()->json([
            'message' => 'Image uploaded successfully',
            'file_path' => $path,
            'url' => $url,
        ], 200);
    }

    /**
     * Block all features for Mandatory Survey.
     */
    public function getActiveMandatorySurvey()
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasAnyRole('student')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $studentInformationId = $user->studentInformation->id;

        // Get IDs of mandatory + visible surveys
        $mandatorySurveyIds = Survey::whereIn('visibility_mode', 'mandatory')
            ->pluck('id');

        // Get submitted surveys by student
        $submittedSurveyIds = SurveyResponse::where('student_information_id', $studentInformationId)
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

       public function toggleVisibility(Request $request, $id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $survey = Survey::findOrFail($id);

        $survey->visibility_mode = $survey->visibility_mode === 'hidden' ? 'optional' : 'hidden';
        $survey->save();

        return response()->json([
            'message' => 'Visibility updated successfully.',
        ]);
    }

    /**
     * Remove the specified survey from storage.
     */
    public function destroy(string $id)
    {
        $user = JWTAuth::authenticate();
        $survey = Survey::findOrFail($id);

        if (!$user->hasAnyRole(['psas', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $survey->delete();

        return response()->json(['message' => 'Survey deleted successfully.']);
    }
}

/**$mandatorySurveys = Survey::where('visibility_mode', 'mandatory')->get();

$incomplete = $mandatorySurveys->filter(function ($survey) use ($user) {
    return !$survey->users()->where('user_id', $user->id)->whereNotNull('completed_at')->exists();
});

if ($incomplete->isNotEmpty()) {
    // redirect to survey page or block access
}
 */