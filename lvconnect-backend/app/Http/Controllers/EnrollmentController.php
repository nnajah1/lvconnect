<?php

namespace App\Http\Controllers;

use App\Models\EnrolleeRecord;
use App\Models\EnrollmentSchedule;
use App\Models\StudentInformation;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\StudentFamilyInformation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


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

        if ($user->hasRole('registrar')) { 
            return StudentInformation::with('enrolleeRecord')
                ->get();
        }

        return response()->json(['message' => 'Unauthorized'], 403);

    }

    /**
     * Enrollment for student.
     */
    public function studentEnrollment(Request $request)
    {
        try {
            $user = JWTAuth::authenticate();

            if (!$user->hasRole('student')) {
                return response()->json(['message' => 'Unauthorized. Only students can enroll.'], 403);
            }

            $validated = $request->validate([
                'program_id' => 'required|exists:programs,id',
                'year_level' => 'required|integer|min:1',
                'privacy_policy' => 'required|boolean',
                'enrollment_schedule_id' => 'required|exists:enrollment_schedules,id',
                'address' => 'required|array',
                'contact_number' => 'required|string',
                'guardian' => 'required|array',
            ], [
                'program_id.required' => 'Program is required.',
                'program_id.exists' => 'Selected program is invalid.',
                'year_level.required' => 'Year level is required.',
                'year_level.integer' => 'Year level must be a number.',
                'privacy_policy.required' => 'You must agree to the privacy policy.',
                'enrollment_schedule_id.required' => 'Enrollment schedule is required.',
                'enrollment_schedule_id.exists' => 'Selected enrollment schedule is invalid.',
                'address.required' => 'Address is required.',
                'contact_number.required' => 'Contact number is required.',
                'guardian.required' => 'Guardian information is required.',
            ]);

            $studentInfo = StudentInformation::where('user_id', $user->id)->first();

            if (!$studentInfo) {
                return response()->json(['message' => 'Student information not found.'], 404);
            }

            // Check if enrollment schedule is active
            $schedule = EnrollmentSchedule::find($validated['enrollment_schedule_id']);
            if (!$schedule->is_active) {
                return response()->json(['message' => 'Enrollment for the selected schedule is currently closed.'], 403);
            }

            // Prevent duplicate enrollment
            $alreadyEnrolled = EnrolleeRecord::where('student_information_id', $studentInfo->id)
                ->where('enrollment_schedule_id', $validated['enrollment_schedule_id'])
                ->exists();

            if ($alreadyEnrolled) {
                return response()->json(['message' => 'You already submitted an enrollment for this schedule.'], 409);
            }

            DB::transaction(function () use ($validated, $studentInfo) {
                // Update address/contact only if changed
                $studentInfo->update([
                    'floor/unit/building_no' => $validated['address']['building_no'] ?? $studentInfo['floor/unit/building_no'],
                    'house_no/street' => $validated['address']['street'] ?? $studentInfo['house_no/street'],
                    'barangay' => $validated['address']['barangay'] ?? $studentInfo->barangay,
                    'city_municipality' => $validated['address']['city'] ?? $studentInfo->city_municipality,
                    'province' => $validated['address']['province'] ?? $studentInfo->province,
                    'zip_code' => $validated['address']['zip'] ?? $studentInfo->zip_code,
                    'mobile_number' => $validated['contact_number'] ?? $studentInfo->mobile_number,
                ]);

                // Update or create guardian information
                StudentFamilyInformation::updateOrCreate(
                    ['student_information_id' => $studentInfo->id],
                    [
                        'guardian_first_name' => $validated['guardian']['first_name'],
                        'guardian_middle_name' => $validated['guardian']['middle_name'],
                        'guardian_last_name' => $validated['guardian']['last_name'],
                        'guardian_religion' => $validated['guardian']['religion'],
                        'guardian_occupation' => $validated['guardian']['occupation'],
                        'guardian_monthly_income' => $validated['guardian']['monthly_income'],
                        'guardian_mobile_number' => $validated['guardian']['mobile_number'],
                        'guardian_relationship' => $validated['guardian']['relationship'],
                    ]
                );

                // Create new enrollment record
                EnrolleeRecord::create([
                    'student_information_id' => $studentInfo->id,
                    'program_id' => $validated['program_id'],
                    'year_level' => $validated['year_level'],
                    'privacy_policy' => $validated['privacy_policy'],
                    'enrollment_schedule_id' => $validated['enrollment_schedule_id'],

                    
                    'enrollment_status' => 'pending',
                    'admin_remarks' => '',
                    'submission_date' => now(),
                ]);
            });

            return response()->json(['message' => 'Enrollment submitted successfully.']);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while submitting the enrollment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show Information for pre-filled enrollment for student.
     */
    public function showEnrollmentData()
    {
        $user = JWTAuth::authenticate();
        $studentInfo = StudentInformation::where('user_id', $user->id)->with('guardian')->first();

        if (!$studentInfo) {
            return response()->json(['message' => 'Student information not found.'], 404);
        }

        return response()->json([
            'student_info' => $studentInfo,
            'guardian' => $studentInfo->guardian,
        ]);
    }
    /**
     * Manual enrollment for student.
     */    
    public function manualEnrollment(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('registrar')) {
            return response()->json(['message' => 'Unauthorized. Only registrars can perform this action.'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'program_id' => 'required|exists:programs,id',
            'year_level' => 'required|integer|min:1',
            'privacy_policy' => 'required|boolean',
            'enrollment_schedule_id' => 'required|exists:enrollment_schedules,id',
            'admin_remarks' => 'nullable|string|max:1000',
        ], [
            'user_id.required' => 'Please select a student.',
            'user_id.exists' => 'Selected student does not exist.',
            'program_id.required' => 'Program is required.',
            'program_id.exists' => 'Selected program is invalid.',
            'year_level.required' => 'Year level is required.',
            'year_level.integer' => 'Year level must be a number.',
            'privacy_policy.required' => 'Privacy policy agreement is required.',
            'enrollment_schedule_id.required' => 'Enrollment schedule is required.',
            'enrollment_schedule_id.exists' => 'Selected enrollment schedule is invalid.',
        ]);

        $studentInfo = StudentInformation::where('user_id', $validated['user_id'])->first();

        if (!$studentInfo) {
            return response()->json(['message' => 'Student information not found for the selected user.'], 404);
        }

        // Prevent duplicate enrollment record for same schedule
        $alreadyEnrolled = EnrolleeRecord::where('student_information_id', $studentInfo->id)
            ->where('enrollment_schedule_id', $validated['enrollment_schedule_id'])
            ->exists();

        if ($alreadyEnrolled) {
            return response()->json(['message' => 'Student is already enrolled for the selected schedule.'], 409);
        }

        try {
            DB::transaction(function () use ($validated, $studentInfo) {
                EnrolleeRecord::create([
                    'student_information_id' => $studentInfo->id,
                    'program_id' => $validated['program_id'],
                    'year_level' => $validated['year_level'],
                    'privacy_policy' => $validated['privacy_policy'],
                    'enrollment_schedule_id' => $validated['enrollment_schedule_id'],
                    'enrollment_status' => 'enrolled', // Directly enrolled
                    'admin_remarks' => $validated['admin_remarks'] ?? '',
                    'submission_date' => now(),
                ]);
            });

            return response()->json(['message' => 'Student enrolled successfully.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to enroll student.', 'error' => $e->getMessage()], 500);
        }
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

        if (!$user->hasRole(['student', 'registrar'])) { 
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
     * Approve student enrollment.
     */
    public function approve($id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('registrar')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $record = EnrolleeRecord::find($id);

        if (!$record) {
            return response()->json(['message' => 'Enrollee record not found.'], 404);
        }

        $record->enrollment_status = 'enrolled';
        $record->save();

        return response()->json([
            'message' => 'Enrollment approved successfully.',
            'data' => $record
        ]);
    }

    /**
     * Reject student enrollment.
     */
    public function reject(Request $request, $id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('registrar')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $record = EnrolleeRecord::find($id);

        if (!$record) {
            return response()->json(['message' => 'Enrollee record not found.'], 404);
        }

        $request->validate([
            'admin_remarks' => 'required|string|max:1000',
        ]);

        $record->enrollment_status = 'rejected';
        $record->admin_remarks = $request->input('admin_remarks');
        $record->save();

        return response()->json([
            'message' => 'Enrollment rejected successfully.',
            'data' => $record
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $enrollment = EnrolleeRecord::find($id);

            if (!$enrollment) {
                return response()->json(['message' => 'Enrollment record not found.'], 404);
            }

            $enrollment->delete();

            return response()->json(['message' => 'Enrollment record deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete enrollment record.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
