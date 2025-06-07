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

        $schedules = Schedule::with('course')
            ->where('program_id', $student->program_id)
            ->where('year_level', $student->year_level)
            ->when($student->section, function ($query) use ($student) {
                $query->where('section', $student->section);
            })
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'schedules' => $schedules,
        ]);
    }
}
