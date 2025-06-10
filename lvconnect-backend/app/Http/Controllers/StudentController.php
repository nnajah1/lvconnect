<?php

namespace App\Http\Controllers;

use App\Models\EnrollmentSchedule;
use Illuminate\Http\Request;
use App\Models\Grade;
use App\Models\GradeTemplate;
use App\Models\Schedule;
use Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class StudentController extends Controller
{
    public function viewGrades()
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('student')) {
            return response()->json(['message' => 'Unauthorized. Only students can view grades.'], 403);
        }

        $student = $user->studentInformation;

        if (!$student) {
            return response()->json(['message' => 'Student information not found.'], 404);
        }

        $studentInformationId = $student->id;

        $grades = Grade::with('course')
            ->where('student_information_id', $studentInformationId)
            ->get()
            ->map(function ($grade) {
                return [
                    'course_code' => $grade->course->course_code,
                    'course' => $grade->course->course,
                    'grade' => $grade->grade,
                    'units' => $grade->course->unit,
                    'remarks' => $grade->remarks,
                    'term' => $grade->term,
                    'academic_year' => $grade->academic_year,
                    'all_units' => Grade::where('student_information_id', $grade->student_information_id)
                        ->where('academic_year', $grade->academic_year)
                        ->where('term', $grade->term)
                        ->with('course')
                        ->get()
                        ->sum(fn($g) => $g->course->unit),
                ];
            })
            ->groupBy(fn($grade) => $grade['academic_year'] . ' - ' . $grade['term']);

        $gradeTemplates = GradeTemplate::where('student_information_id', $studentInformationId)
            ->get()
            ->map(function ($template) {
                return [
                    'term' => $template->term,
                    'school_year' => $template->school_year,
                    'target_GWA' => $template->target_GWA,
                    'actual_GWA' => $template->actual_GWA,
                    'status' => $template->status,
                ];
            })
            ->groupBy(fn($template) => $template['school_year'] . ' - ' . $template['term']);

        // Get the first school year and term from gradeTemplates
        $firstKey = $gradeTemplates->keys()->first();
        $schoolYear = '';
        $term = '';
        if ($firstKey) {
            [$schoolYear, $term] = explode(' - ', $firstKey);
        }

        $userFormat = [
            'schoolYear' => $schoolYear,
            'term' => $term,
            'program' => $student->program ?? '',
            'yearLevel' => $student->year_level ?? '',
            'student' => [
                'name' => $student->fullname ?? '',
                'studentNumber' => $student->student_id_number ?? '',
                'scholarshipStatus' => $student->scholarship_status ?? '',
            ],
        ];

        return response()->json([
            'user' => $userFormat,
            'grades_by_term' => $grades,
            'grade_templates_by_term' => $gradeTemplates,
        ]);
    }


    public function viewSchedules()
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('student')) {
            return response()->json(['message' => 'Unauthorized. Only students can access schedules.'], 403);
        }

        $student = $user->studentInformation;

        if (!$student) {
            return response()->json(['message' => 'Student information not found.'], 404);
        }

        // Get latest active semester and year
        $latestEnrollmentSchedule = EnrollmentSchedule::with('academicYear')
            ->orderByDesc('start_date')
            ->first();

        if (!$latestEnrollmentSchedule) {
            return response()->json([
                'message' => 'No academic schedule found.',
                'semesterInfo' => null,
                'schedules' => []
            ]);
        }

        $semesterInfo = [
            'schoolYear' => $latestEnrollmentSchedule->school_year,
            'semester' => $latestEnrollmentSchedule->semester,
        ];
        // Year level mapping
        $yearLevelMap = [
            1 => '1st Year',
            2 => '2nd Year',
            3 => '3rd Year',
            4 => '4th Year',
        ];

        $mappedYearLevel = $yearLevelMap[$student->year_level] ?? null;

        if (!$mappedYearLevel) {
            return response()->json([
                'message' => 'Invalid year level format.',
                'semesterInfo' => $semesterInfo,
                'schedules' => []
            ]);
        }

        // Color palette for schedule display
        $colorPalette = [
            ['bg' => 'bg-orange-200', 'text' => 'text-orange-900'],
            ['bg' => 'bg-blue-200', 'text' => 'text-blue-900'],
            ['bg' => 'bg-green-200', 'text' => 'text-green-900'],
            ['bg' => 'bg-purple-200', 'text' => 'text-purple-900'],
            ['bg' => 'bg-pink-200', 'text' => 'text-pink-900'],
        ];

        // Retrieve schedules based on program and year level
        $schedules = Schedule::with('course')
            ->where('program_id', $student->program_id)
            ->where('year_level', $mappedYearLevel)
            ->when($student->section, function ($query) use ($student) {
                $query->where('section', $student->section);
            })
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        $formatted = [];
        $formatted = [];

        foreach ($schedules as $index => $schedule) {
            $colorSet = $colorPalette[$index % count($colorPalette)];
            $formatted[] = [
                'day' => $schedule->day,
                'time' => date('g:i A', strtotime($schedule->start_time)) . ' - ' . date('g:i A', strtotime($schedule->end_time)),
                'subject' => $schedule->course->course ?? 'N/A',
                'tag' => $schedule->room ?? 'N/A',
                'color' => $colorSet['bg'],
                'textColor' => $colorSet['text'],
            ];
        }

        return response()->json([
            'semesterInfo' => $semesterInfo,
            'schedules' => $formatted,
        ]);
    }
}
