<?php

namespace App\Http\Controllers;

use App\Models\EnrolleeRecord;
use App\Models\EnrollmentSchedule;
use App\Models\StudentInformation;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = JWTAuth::authenticate();

        if ($user->hasRole('student')) {
            return EnrolleeRecord::where('id', $user->id)
                ->get();
        }

        if ($user->hasRole('registrar')) { //change to registrar
            return StudentInformation::with('enrolleeRecord')
                ->get();
        }

        return response()->json(['message' => 'Unauthorized'], 403);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = JWTAuth::authenticate();
        if (!$user->hasRole(['student', 'registrar'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);
    }

    /**
     * Open and Close Enrollment
     */
    public function toggleEnrollmentSchedule(Request $request)
    {
        $data = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester' => 'required|in:1st_semester,second_semester',
            'is_active' => 'required|boolean',
        ]);

        if ($data['semester'] === 'second_semester') {
            $firstSemesterExists = EnrollmentSchedule::where('academic_year_id', $data['academic_year_id'])
                ->where('semester', '1st_semester')
                ->exists();

            if (!$firstSemesterExists) {
                return response()->json([
                    'message' => 'Cannot open 2nd semester before 1st semester is created.'
                ], 422);
            }
        }

        // When opening enrollment
        if ($data['is_active']) {
            // Close all active schedules for this academic year (any semester)
            EnrollmentSchedule::where('academic_year_id', $data['academic_year_id'])
                ->update(['is_active' => false]);

            // Either create or update the current semester
            $schedule = EnrollmentSchedule::updateOrCreate(
                [
                    'academic_year_id' => $data['academic_year_id'],
                    'semester' => $data['semester'],
                ],
                [
                    'is_active' => true,
                    'start_date' => now(),
                    'end_date' => null,
                ]
            );
        } else {
            // Closing enrollment for this semester
            $schedule = EnrollmentSchedule::where('academic_year_id', $data['academic_year_id'])
                ->where('semester', $data['semester'])
                ->first();

            if ($schedule) {
                $schedule->update([
                    'is_active' => false,
                    'end_date' => now(),
                ]);
            } else {
                return response()->json(['message' => 'Schedule not found.'], 404);
            }
        }

        return response()->json([
            'data' => $schedule,
            'message' => 'Enrollment schedule updated.',
        ]);
    }

    /**
     * Action Buttons
     */
    public function bulkApprove(Request $request)
    {
        $ids = $request->input('ids');
        // Update status to "enrolled"
        EnrolleeRecord::whereIn('id', $ids)->update(['enrollment_status' => 'enrolled']);
        return response()->json(['message' => 'Approved successfully.']);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids');
        EnrolleeRecord::whereIn('id', $ids)->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }
    public function bulkExport(Request $request)
    {
        $ids = $request->input('ids');
        $data = EnrolleeRecord::whereIn('id', $ids)->get();
        // Return data to be exported ( format it as CSV if needed)
        return response()->json($data);
    }

    public function bulkRemind(Request $request)
    {
        $ids = $request->input('ids');
        // Implement reminder logic (e.g., send email notifications)
        return response()->json(['message' => 'Reminders sent.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = JWTAuth::authenticate();
        $studentRecord = EnrolleeRecord::with('studentInfo')->findOrFail($id);

        if (!$user->hasRole(['student', 'registrar'])) { //change to registrar
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($studentRecord);
    }

    public function showEnrollmentSchedule(Request $request)
    {
        $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester' => 'required|in:1st_semester,second_semester',
        ]);

        $schedule = EnrollmentSchedule::where('academic_year_id', $request->academic_year_id)
            ->where('semester', $request->semester)
            ->latest()
            ->first();

        return response()->json($schedule);
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
