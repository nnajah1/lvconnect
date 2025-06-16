<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\EnrolleeRecord;
use App\Models\FormSubmission;
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

        // Visible surveys
        $visibleSurveys = Survey::where('visibility_mode', 'optional')->count();

        // Student Population
        $studentPopulation = DB::table('enrollee_records')
            ->join('student_information', 'enrollee_records.student_information_id', '=', 'student_information.id')
            ->join('programs', 'enrollee_records.program_id', '=', 'programs.id')
            ->where('enrollee_records.enrollment_status', 'enrolled')
            ->where('enrollee_records.enrollment_schedule_id', $currentAcademicYearId) 
            ->select(
                'programs.id as program_id',
                'programs.program_name',
                'student_information.province',
                'student_information.city_municipality',
                'student_information.barangay',
                DB::raw('`student_information`.`house_no/street` as house_street'),
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
                return [
                    'program_name' => $group->first()->program_name,
                    'addresses' => $group->map(function ($item) {
                        return [
                            'province' => $item->province,
                            'city_municipality' => $item->city_municipality,
                            'barangay' => $item->barangay,
                            'street' => $item->house_street,
                            'student_count' => $item->student_count,
                        ];
                    })->values(),
                ];
            })->values();

        // Forms pie chart
        $formSubmissionCounts = FormSubmission::select('form_type_id', DB::raw('COUNT(*) as count'))
            ->groupBy('form_type_id')
            ->with('formType:id,title') 
            ->get()
            ->map(function ($submission) {
                return [
                    'form_type' => $submission->formType?->title ?? 'Unknown Form',
                    'count' => $submission->count,
                ];
            });

        // Visible Forms
        $visibleForms = DB::table('form_types')
            ->where('is_visible', true)
            ->count();

        // Pending form submissions
        $pendingFormCount = FormSubmission::where('status', 'pending')->count();

        // Flooded Area Stats
        $floodedStreets = [
            '123 St.',
            '456 St.',
            '111 Malolos St.',
            '303 Sampaloc St.',
            '202 Sulipan Road',
            '333 MacArthur Highway',
        ];

        $studentsInFloodedAreas = DB::table('student_information')
            ->whereIn('`house_no/street`', $floodedStreets)
            ->count();


        $stats = [
            'current_enrolled_students' => $currentEnrolledCount,
            'visible_surveys' => $visibleSurveys,
            'visible_forms' => $visibleForms,
            'pending_form_submissions' => $pendingFormCount,
            'students_in_flooded_areas' => $studentsInFloodedAreas,
        ];

        return response()->json([
            'stats' => $stats,
            'student_population' => $studentPopulation,
            'form_submission_counts' => $formSubmissionCounts, 
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

        // Get current academic year using latest created_at
        $currentAcademicYearId = DB::table('enrollment_schedules')
            ->latest('created_at')
            ->value('id');

        // Count all enrolled students
        $currentEnrolledCount = DB::table('enrollee_records')
            ->where('enrollment_status', 'enrolled')
            ->where('enrollment_schedule_id', $currentAcademicYearId)
            ->count();

        $pendingSchoolUpdates = DB::table('school_updates')
            ->where('status', 'pending')
            ->count();

        $totalScholarshipInvestment = DB::table('fee_templates')
            ->join('enrollee_records', 'fee_templates.academic_year_id', '=', 'enrollee_records.enrollment_schedule_id')
            ->where('fee_templates.is_visible', true)
            ->where('enrollee_records.enrollment_status', 'enrolled')
            ->selectRaw('SUM(fee_templates.whole_academic_year) * COUNT(enrollee_records.id) as projected_revenue')
            ->value('projected_revenue');



        // Student Population
        $studentPopulation = DB::table('enrollee_records')
            ->join('student_information', 'enrollee_records.student_information_id', '=', 'student_information.id')
            ->join('programs', 'enrollee_records.program_id', '=', 'programs.id')
            ->where('enrollee_records.enrollment_status', 'enrolled')
            ->where('enrollee_records.enrollment_schedule_id', $currentAcademicYearId)
            ->select(
                'programs.id as program_id',
                'programs.program_name',
                'student_information.province',
                'student_information.city_municipality',
                'student_information.barangay',
                DB::raw('`student_information`.`house_no/street` as house_street'),
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
                return [
                    'program_name' => $group->first()->program_name,
                    'addresses' => $group->map(function ($item) {
                        return [
                            'province' => $item->province,
                            'city_municipality' => $item->city_municipality,
                            'barangay' => $item->barangay,
                            'street' => $item->house_street,
                            'student_count' => $item->student_count,
                        ];
                    })->values(),
                ];
            })->values();

        $enrolledStatusOverview = DB::table('enrollee_records')
            ->select('enrollment_status', DB::raw('COUNT(*) as count'))
            ->where('enrollment_schedule_id', $currentAcademicYearId)
            ->whereIn('enrollment_status', ['enrolled', 'rejected'])
            ->groupBy('enrollment_status')
            ->pluck('count', 'enrollment_status');

        $stats = [
            'current_enrolled_students' => $currentEnrolledCount,
            'pending_school_updates' => $pendingSchoolUpdates,
            'total_scholarship_investment' => $totalScholarshipInvestment,
        ];
        return response()->json([
            'stats' => $stats,
            'student_population' => $studentPopulation,
            'enrolled_status_overview' => $enrolledStatusOverview,
        ]);
    }

    /**
     * Dashboard for Registrar.
     */
    public function registrarDashboard()
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('registrar')) {
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

        // Count pending students for that academic year
        $pendingCount = DB::table('enrollee_records')
            ->where('enrollment_status', 'pending')
            ->where('enrollment_schedule_id', $currentAcademicYearId)
            ->count();

        // New student Accounts
        $studentsWithoutInfo = User::whereHas('roles', function ($q) {
            $q->where('name', 'student');
            })
            ->whereDoesntHave('studentInformation')
            ->count();
        // Count temporary enrolled students for that academic year
        // $temporaryEnrolledCount = DB::table('enrollee_records')
        //     ->where('enrollment_status', 'rejected')
        //     ->where('enrollment_schedule_id', $currentAcademicYearId)
        //     ->count();

        // Student Population
        $studentPopulation = DB::table('enrollee_records')
            ->join('student_information', 'enrollee_records.student_information_id', '=', 'student_information.id')
            ->join('programs', 'enrollee_records.program_id', '=', 'programs.id')
            ->where('enrollee_records.enrollment_status', 'enrolled')
            ->where('enrollee_records.enrollment_schedule_id', $currentAcademicYearId) 
            ->select(
                'programs.id as program_id',
                'programs.program_name',
                'student_information.province',
                'student_information.city_municipality',
                'student_information.barangay',
                DB::raw('`student_information`.`house_no/street` as house_street'),
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
                return [
                    'program_name' => $group->first()->program_name,
                    'addresses' => $group->map(function ($item) {
                        return [
                            'province' => $item->province,
                            'city_municipality' => $item->city_municipality,
                            'barangay' => $item->barangay,
                            'street' => $item->house_street,
                            'student_count' => $item->student_count,
                        ];
                    })->values(),
                ];
            })->values();

        $enrolledStatusOverview = DB::table('enrollee_records')
            ->select('enrollment_status', DB::raw('COUNT(*) as count'))
            ->where('enrollment_schedule_id', $currentAcademicYearId)
            ->whereIn('enrollment_status', ['enrolled', 'rejected'])
            ->groupBy('enrollment_status')
            ->pluck('count', 'enrollment_status');

        $enrolledPerProgram = DB::table('enrollee_records')
            ->join('programs', 'enrollee_records.program_id', '=', 'programs.id')
            ->where('enrollee_records.enrollment_status', 'enrolled')
            ->where('enrollee_records.enrollment_schedule_id', $currentAcademicYearId) // ✅ filter by current year
            ->select('programs.program_name', DB::raw('COUNT(*) as student_count'))
            ->groupBy('programs.program_name')
            ->get();

        $stats = [
            'current_enrolled_student' => $currentEnrolledCount,
            'pending_student_count' => $pendingCount,
            'students_without_info' => $studentsWithoutInfo,
            // 'temporary_enrolled_student_count' => $temporaryEnrolledCount,
        ];

        return response()->json([
            'stats' => $stats,
            'student_population' => $studentPopulation,
            'enrolled_status_overview' => $enrolledStatusOverview,
            'enrolled_per_program' => $enrolledPerProgram,
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
