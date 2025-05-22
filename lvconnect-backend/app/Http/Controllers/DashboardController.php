<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use DB;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }
        /**
     * Analytics for PSAS Dashboard.
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
        $visibleSurveys = Survey::where('visibility_mode', 'optional')->count();
        $mandatorySurveys = Survey::where('visibility_mode', 'mandatory')->count();

        // Total survey answers submitted
        $totalAnswers = SurveyAnswer::count();

        // How many students from different programs answered each survey
        $responsesByProgram = Survey::get()->map(function ($survey) {
            $programCounts = DB::table('survey_responses')
                ->join('enrollee_records', 'survey_responses.student_information_id', '=', 'enrollee_records.student_information_id')
                ->join('programs', 'enrollee_records.program_id', '=', 'programs.id')
                ->where('survey_responses.survey_id', $survey->id)
                ->select('programs.id as program_id', 'programs.program_name', DB::raw('COUNT(DISTINCT survey_responses.student_information_id) as student_count'))
                ->groupBy('programs.id', 'programs.program_name')
                ->get();

            return [
                'survey_id' => $survey->id,
                'survey_title' => $survey->title,
                'responses_by_program' => $programCounts,
            ];
        });

        return response()->json([
            'total_students' => $totalStudents,
            'visible_surveys' => $visibleSurveys,
            'mandatory_surveys' => $mandatorySurveys,
            'total_answers_submitted' => $totalAnswers,
            'responses_by_program' => $responsesByProgram,
        ]);
    }

    /**
     * Analytics for Summary PSAS.
     */
    public function analytictsSummary()
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get all surveys with their questions
        $surveys = Survey::with('questions')->get();

        $summary = [];

        foreach ($surveys as $survey) {
            $questionsSummary = [];

            foreach ($survey->questions as $question) {
                // Count distinct student_information_id who answered this question
                $count = SurveyAnswer::where('survey_question_id', $question->id)
                    ->join('survey_responses', 'survey_answers.survey_response_id', '=', 'survey_responses.id')
                    ->where('survey_responses.survey_id', $survey->id)
                    ->distinct('survey_responses.student_information_id')
                    ->count('survey_responses.student_information_id');

                $questionsSummary[] = [
                    'question_id' => $question->id,
                    'question' => $question->question,
                    'student_answers_count' => $count,
                ];
            }

            $summary[] = [
                'survey_id' => $survey->id,
                'survey_title' => $survey->title,
                'questions' => $questionsSummary,
            ];
        }

        return response()->json($summary);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
