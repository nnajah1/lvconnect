<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Grade;
use App\Models\GradeTemplate;
use App\Models\Schedule;
use Tymon\JWTAuth\Facades\JWTAuth;

class StudentController extends Controller
{
    public function viewGrades($studentInformationId)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('student')) {
            return response()->json(['message' => 'Unauthorized. Only students can view grades.'], 403);
        }

        if ($user->student_information_id !== (int) $studentInformationId) {
            return response()->json(['message' => 'Forbidden. You can only view your own grades.'], 403);
        }

        $student = $user->studentInformation; 
        
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
                ];
            })
            ->groupBy(fn($grade) => $grade['academic_year'] . ' - ' . $grade['term']);

        $templates = GradeTemplate::where('student_information_id', $studentInformationId)->get();

        return response()->json([
            'grades_by_term' => $grades,
            'grade_templates' => $templates,
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

        $schedules = Schedule::with('course', 'enrollmentSchedule')
            ->where('program_id', $student->program_id)
            ->where('year_level', $student->year_level)
            ->when($student->section, function ($query) use ($student) {
                $query->where('section', $student->section);
            })
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        $colorPalette = [
            ['bg' => 'bg-orange-200', 'text' => 'text-orange-900'],
            ['bg' => 'bg-blue-200', 'text' => 'text-blue-900'],
            ['bg' => 'bg-green-200', 'text' => 'text-green-900'],
            ['bg' => 'bg-purple-200', 'text' => 'text-purple-900'],
            ['bg' => 'bg-pink-200', 'text' => 'text-pink-900'],
        ];

        $formatted = [];

        foreach ($schedules as $index => $schedule) {
            $colorSet = $colorPalette[$index % count($colorPalette)];

            $formatted = [
                'day' => $schedule->day,
                'time' => date('g:i A', strtotime($schedule->start_time)) . ' - ' . date('g:i A', strtotime($schedule->end_time)),
                'subject' => $schedule->course->title ?? 'N/A',
                'tag' => $schedule->course->code ?? 'N/A',
                'color' => $colorSet['bg'],
                'textColor' => $colorSet['text'],
            ];
        }

        $semesterInfo = null;
        if ($schedules->isNotEmpty()) {
            $enrollmentSchedule = $schedules->first()->enrollmentSchedule;
            $semesterInfo = [
                'schoolYear' => $enrollmentSchedule->school_year ?? 'N/A',
                'semester' => $enrollmentSchedule->semester ?? 'N/A',
            ];
        }

        return response()->json([
            'semesterInfo' => $semesterInfo,
            'schedules' => $formatted,
        ]);
    }

}
