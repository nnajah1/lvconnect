<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\EnrolleeRecord;
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

        // Get current academic year using latest created_at
        $currentAcademicYearId = DB::table('enrollment_schedules')
            ->latest('created_at')
            ->value('id');

        // Count enrolled students for that academic year
        $currentEnrolledCount = DB::table('enrollee_records')
            ->where('enrollment_status', 'enrolled')
            ->where('enrollment_schedule_id', $currentAcademicYearId)
            ->count();

        // Visible and mandatory surveys
        $visibleSurveys = Survey::where('visibility_mode', 'optional')->count();
        $mandatorySurveys = Survey::where('visibility_mode', 'mandatory')->count();

        // Total survey answers submitted
        $totalAnswers = SurveyAnswer::count();

        // Student Demographics
        $demographics = DB::table('enrollee_records')
            ->join('student_information', 'enrollee_records.student_information_id', '=', 'student_information.id')
            ->join('programs', 'enrollee_records.program_id', '=', 'programs.id')
            ->where('enrollee_records.enrollment_status', 'enrolled')
            ->select(
                'programs.id as program_id',
                'programs.program_name',
                'student_information.province',
                'student_information.city_municipality',
                'student_information.barangay',
                DB::raw('`student_information`.`house_no/street` as street'),
                DB::raw('COUNT(*) as student_count')
            )
            ->groupBy(
                'programs.id',
                'programs.program_name',
                'student_information.province',
                'student_information.city_municipality',
                'student_information.barangay',
                DB::raw('`student_information`.`house_no/street`')
            )
            ->get()
            ->groupBy('program_id')
            ->map(function ($group) {
                $programName = $group->first()->program_name;
                return [
                    'program_name' => $programName,
                    'addresses' => $group->map(function ($item) {
                        return [
                            'province' => $item->province,
                            'city_municipality' => $item->city_municipality,
                            'barangay' => $item->barangay,
                            'street' => $item->street,
                            'student_count' => $item->student_count,
                        ];
                    })->values(),
                ];
            })->values();

        return response()->json([
            'current_enrolled_students' => $currentEnrolledCount,
            'visible_surveys' => $visibleSurveys,
            'mandatory_surveys' => $mandatorySurveys,
            'total_answers_submitted' => $totalAnswers,
            'student_demographics' => $demographics,
        ]);
    }

    /**
     * Analytics for Summary PSAS.
     */
   public function analyticsSummary($surveyId)
{
    $user = JWTAuth::authenticate();

    if (!$user->hasRole('psas')) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }


    if (!$surveyId) {
        return response()->json(['message' => 'Survey ID is required.'], 400);
    }

    $survey = Survey::with('questions')->find($surveyId);

    if (!$survey) {
        return response()->json(['message' => 'Survey not found.'], 404);
    }

    $questionsSummary = [];

    foreach ($survey->questions as $question) {
        $questionType = strtolower($question->survey_question_type);
        $questionData = $question->survey_question_data;

        $questionSummary = [
            'question_id' => $question->id,
            'question' => $question->question,
            'type' => $questionType,
        ];

        // Handle choice-based types
        if (
            in_array($questionType, ['multiple choice', 'checkboxes', 'dropdown']) &&
            isset($questionData['choices']) && is_array($questionData['choices'])
        ) {
            $optionCounts = [];

            foreach ($questionData['choices'] as $option) {
                $optionText = is_array($option) ? ($option['label'] ?? $option['value'] ?? '') : $option;
                $count = SurveyAnswer::where('survey_question_id', $question->id)
                    ->where('answer', $optionText)
                    ->count();

                $optionCounts[] = [
                    'option' => $optionText,
                    'count' => $count,
                ];
            }

            $questionSummary['responses'] = $optionCounts;
        }

        // Handle short answer
        elseif ($questionType === 'short answer') {
            $answers = SurveyAnswer::where('survey_question_id', $question->id)
                ->pluck('answer');

            $questionSummary['responses'] = $answers;
        }

        // Handle image uploads
        elseif ($questionType === 'upload photo') {
            $images = SurveyAnswer::where('survey_question_id', $question->id)
                ->pluck('img_url');

            $questionSummary['responses'] = $images;
        }

        // Default case: just count distinct respondents
        else {
            $respondentCount = SurveyAnswer::where('survey_question_id', $question->id)
                ->join('survey_responses', 'survey_answers.survey_response_id', '=', 'survey_responses.id')
                ->where('survey_responses.survey_id', $survey->id)
                ->distinct('survey_responses.student_information_id')
                ->count('survey_responses.student_information_id');

            $questionSummary['student_answers_count'] = $respondentCount;
        }

        $questionsSummary[] = $questionSummary;
    }

    $summary = [
        'survey_id' => $survey->id,
        'survey_title' => $survey->title,
        'questions' => $questionsSummary,
    ];

    return response()->json($summary);
}



    /**
     * Dashboard for School Admin.
     */
    public function schoolAdminDashboard()
    {
        $user = JWTAuth::authenticate();

        // Allow only users with the 'scadmin' role
        if (!$user->hasRole('scadmin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Count all enrolled students from past to present
        $totalEnrolled = DB::table('enrollee_records')
            ->where('enrollment_status', 'enrolled')
            ->count();

        // Get the academic year total from the visible, saved fee template
        $academicYearFee = DB::table('fee_templates')
            ->where('status', 'saved')
            ->where('is_visible', true)
            ->value('whole_academic_year');

        // Compute the total investment
        $totalInvestment = $totalEnrolled * $academicYearFee;

        // Student Demographics
        $demographics = DB::table('enrollee_records')
            ->join('student_information', 'enrollee_records.student_information_id', '=', 'student_information.id')
            ->join('programs', 'enrollee_records.program_id', '=', 'programs.id')
            ->where('enrollee_records.enrollment_status', 'enrolled')
            ->select(
                'programs.id as program_id',
                'programs.program_name',
                'student_information.province',
                'student_information.city_municipality',
                'student_information.barangay',
                DB::raw('`student_information`.`house_no/street` as street'),
                DB::raw('COUNT(*) as student_count')
            )
            ->groupBy(
                'programs.id',
                'programs.program_name',
                'student_information.province',
                'student_information.city_municipality',
                'student_information.barangay',
                DB::raw('`student_information`.`house_no/street`')
            )
            ->get()
            ->groupBy('program_id')
            ->map(function ($group) {
                $programName = $group->first()->program_name;
                return [
                    'program_name' => $programName,
                    'addresses' => $group->map(function ($item) {
                        return [
                            'province' => $item->province,
                            'city_municipality' => $item->city_municipality,
                            'barangay' => $item->barangay,
                            'street' => $item->street,
                            'student_count' => $item->student_count,
                        ];
                    })->values(),
                ];
            })->values();

        // Get current academic year using latest created_at
        $currentAcademicYearId = DB::table('enrollment_schedules')
            ->latest('created_at')
            ->value('id');

        // Get population of enrolled students grouped by program for the present academic year
        $higherEdPopulation = DB::table('enrollee_records')
            ->join('programs', 'enrollee_records.program_id', '=', 'programs.id')
            ->where('enrollee_records.enrollment_status', 'enrolled')
            ->where('enrollee_records.enrollment_schedule_id', $currentAcademicYearId)
            ->select('programs.program_name', DB::raw('COUNT(*) as student_count'))
            ->groupBy('programs.program_name')
            ->get();


        return response()->json([
            'total_enrolled_students' => $totalEnrolled,
            'total_investment' => $totalInvestment,
            'student_demographics' => $demographics,
            'higher_ed_population' => $higherEdPopulation,
        ]);
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
