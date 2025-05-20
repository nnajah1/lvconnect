<?php

namespace App\Http\Controllers;

use App\Models\EnrolleeRecord;
use App\Models\EnrollmentSchedule;
use App\Models\StudentInformation;
use App\Models\AcademicYear;
use App\Models\User;
use App\Models\StudentFamilyInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Validation\ValidationException;
use App\Notifications\EnrollmentNotification;
use App\Notifications\EnrollmentStatusNotification;
use Illuminate\Support\Facades\Notification;

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

            $isEnrollmentOpen = EnrollmentSchedule::where('is_active', true)->exists();

            if (!$isEnrollmentOpen) {
                return response()->json(['message' => 'Enrollment is currently closed.'], 403);
            }

            $validated = $request->validate([
                'program_id' => 'required|exists:programs,id',
                'year_level' => 'required|integer|min:1',
                'privacy_policy' => 'required|boolean',
                'address' => 'required|array',
                'mobile_number' => 'required|string',
                'guardian' => 'required|array',
                'mother' => 'required|array',
                'father' => 'required|array',
                'student_id_number' => 'required|string|max:50',
                'fb_link' => 'nullable|url',
            ], [
                'program_id.required' => 'Program is required.',
                'program_id.exists' => 'Selected program is invalid.',
                'year_level.required' => 'Year level is required.',
                'year_level.integer' => 'Year level must be a number.',
                'privacy_policy.required' => 'You must agree to the privacy policy.',
                'address.required' => 'Address is required.',
                'mobile_number.required' => 'mobile number is required.',
                'guardian.required' => 'Guardian information is required.',
                'mother.required' => 'Mother information is required.',
                'father.required' => 'Father information is required.',
                'student_id_number.required' => 'Student ID number is required.',
                'fb_link.url' => 'Facebook link must be a valid URL.',
            ]);

            $studentInfo = StudentInformation::where('user_id', $user->id)->first();

            if (!$studentInfo) {
                return response()->json(['message' => 'Student information not found.'], 404);
            }

            $alreadyEnrolled = EnrolleeRecord::where('student_information_id', $studentInfo->id)
                ->where('program_id', $validated['program_id'])
                ->where('year_level', $validated['year_level'])
                ->exists();

            if ($alreadyEnrolled) {
                return response()->json(['message' => 'You have already submitted an enrollment for this program and year level.'], 409);
            }

            DB::transaction(function () use ($validated, $studentInfo) {
                $studentInfo->update([
                    'floor/unit/building_no' => $validated['address']['building_no'] ?? $studentInfo['floor/unit/building_no'],
                    'house_no/street' => $validated['address']['street'] ?? $studentInfo['house_no/street'],
                    'barangay' => $validated['address']['barangay'] ?? $studentInfo->barangay,
                    'city_municipality' => $validated['address']['city'] ?? $studentInfo->city_municipality,
                    'province' => $validated['address']['province'] ?? $studentInfo->province,
                    'zip_code' => $validated['address']['zip'] ?? $studentInfo->zip_code,
                    'mobile_number' => $validated['mobile_number'] ?? $studentInfo->mobile_number,
                    'student_id_number' => $validated['student_id_number'] ?? $studentInfo->student_id_number,
                    'fb_link' => $validated['fb_link'] ?? $studentInfo->fb_link,
                ]);

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
                        'mother_religion' => $validated['mother']['religion'] ?? null,
                        'mother_occupation' => $validated['mother']['occupation'] ?? null,
                        'mother_monthly_income' => $validated['mother']['monthly_income'] ?? null,
                        'mother_mobile_number' => $validated['mother']['mobile_number'] ?? null,
                        'father_religion' => $validated['father']['religion'] ?? null,
                        'father_occupation' => $validated['father']['occupation'] ?? null,
                        'father_monthly_income' => $validated['father']['monthly_income'] ?? null,
                        'father_mobile_number' => $validated['father']['mobile_number'] ?? null,
                    ]
                );

                EnrolleeRecord::create([
                    'student_information_id' => $studentInfo->id,
                    'program_id' => $validated['program_id'],
                    'year_level' => $validated['year_level'],
                    'privacy_policy' => $validated['privacy_policy'],
                    'enrollment_status' => 'pending',
                    'admin_remarks' => '',
                    'submission_date' => now(),
                ]);
            });

            return response()->json(['message' => 'Enrollment submitted successfully.']);

        } catch (ValidationException $e) {
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
            'admin_remarks' => 'nullable|string|max:1000',
            'student_id_number' => 'nullable|string|max:255',
            'mobile_number' => 'nullable|string|max:255',
            'address' => 'nullable|array',
            'address.building_no' => 'nullable|string|max:255',
            'address.street' => 'nullable|string|max:255',
            'address.barangay' => 'nullable|string|max:255',
            'address.city' => 'nullable|string|max:255',
            'address.province' => 'nullable|string|max:255',
            'address.zip' => 'nullable|string|max:10',
            'guardian' => 'nullable|array',
            'mother' => 'nullable|array',
            'father' => 'nullable|array',
            'fb_link' => 'nullable|string|max:255',
        ]);

        $studentInfo = StudentInformation::where('user_id', $validated['user_id'])->first();

        if (!$studentInfo) {
            return response()->json(['message' => 'Student information not found for the selected user.'], 404);
        }

        $alreadyEnrolled = EnrolleeRecord::where('student_information_id', $studentInfo->id)
            ->where('program_id', $validated['program_id'])
            ->where('year_level', $validated['year_level'])
            ->exists();

        if ($alreadyEnrolled) {
            return response()->json(['message' => 'Student is already enrolled for the selected program and year level.'], 409);
        }

        try {
            DB::transaction(function () use ($validated, $studentInfo) {
                // Update student info
                $studentInfo->update([
                    'floor/unit/building_no' => $validated['address']['building_no'] ?? $studentInfo['floor/unit/building_no'],
                    'house_no/street' => $validated['address']['street'] ?? $studentInfo['house_no/street'],
                    'barangay' => $validated['address']['barangay'] ?? $studentInfo->barangay,
                    'city_municipality' => $validated['address']['city'] ?? $studentInfo->city_municipality,
                    'province' => $validated['address']['province'] ?? $studentInfo->province,
                    'zip_code' => $validated['address']['zip'] ?? $studentInfo->zip_code,
                    'mobile_number' => $validated['mobile_number'] ?? $studentInfo->mobile_number,
                    'student_id_number' => $validated['student_id_number'] ?? $studentInfo->student_id_number,
                ]);

                // Guardian info
                if (!empty($validated['guardian'])) {
                    StudentFamilyInformation::updateOrCreate(
                        ['student_information_id' => $studentInfo->id],
                        [
                            'guardian_first_name' => $validated['guardian']['first_name'] ?? null,
                            'guardian_middle_name' => $validated['guardian']['middle_name'] ?? null,
                            'guardian_last_name' => $validated['guardian']['last_name'] ?? null,
                            'guardian_religion' => $validated['guardian']['religion'] ?? null,
                            'guardian_occupation' => $validated['guardian']['occupation'] ?? null,
                            'guardian_monthly_income' => $validated['guardian']['monthly_income'] ?? null,
                            'guardian_mobile_number' => $validated['guardian']['mobile_number'] ?? null,
                            'guardian_relationship' => $validated['guardian']['relationship'] ?? null,
                        ]
                    );
                }

                // Mother info
                if (!empty($validated['mother'])) {
                    $mother = $studentInfo->mother;
                    if ($mother) {
                        $mother->update([
                            'mother_religion' => $validated['mother']['religion'] ?? $mother->mother_religion,
                            'mother_occupation' => $validated['mother']['occupation'] ?? $mother->mother_occupation,
                            'mother_monthly_income' => $validated['mother']['monthly_income'] ?? $mother->mother_monthly_income,
                            'mother_mobile_number' => $validated['mother']['mobile_number'] ?? $mother->mother_mobile_number,
                        ]);
                    }
                }

                // Father info
                if (!empty($validated['father'])) {
                    $father = $studentInfo->father;
                    if ($father) {
                        $father->update([
                            'father_religion' => $validated['father']['religion'] ?? $father->father_religion,
                            'father_occupation' => $validated['father']['occupation'] ?? $father->father_occupation,
                            'father_monthly_income' => $validated['father']['monthly_income'] ?? $father->father_monthly_income,
                            'father_mobile_number' => $validated['father']['mobile_number'] ?? $father->father_mobile_number,
                        ]);
                    }
                }

                // Create enrollee record
                EnrolleeRecord::create([
                    'student_information_id' => $studentInfo->id,
                    'program_id' => $validated['program_id'],
                    'year_level' => $validated['year_level'],
                    'privacy_policy' => $validated['privacy_policy'],
                    'enrollment_status' => 'enrolled',
                    'admin_remarks' => $validated['admin_remarks'] ?? '',
                    'submission_date' => now(),
                    'fb_link' => $validated['fb_link'] ?? null,
                ]);

                // Academic year from latest enrollment schedule
                $academicYear = EnrollmentSchedule::with('academicYear')
                    ->latest()
                    ->first()
                    ?->academicYear;

                // Notify the student
                $studentUser = User::find($validated['user_id']);
                if ($studentUser && $academicYear) {
                    $studentUser->notify(new EnrollmentStatusNotification('enrolled', $academicYear));
                }
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

        $academicYear = AcademicYear::find($data['academic_year_id']);
        $students = User::role('student')->get();
        $isOpen = $data['is_active'];

        //open
        if ($isOpen) {
            EnrollmentSchedule::where('academic_year_id', $data['academic_year_id'])->update(['is_active' => false]);

            $schedule = EnrollmentSchedule::updateOrCreate(
                ['academic_year_id' => $data['academic_year_id'], 'semester' => $data['semester']],
                ['is_active' => true, 'start_date' => now(), 'end_date' => null]
            );
        } 
        //close
        else {
            $schedule = EnrollmentSchedule::where('academic_year_id', $data['academic_year_id'])
                ->where('semester', $data['semester'])->first();

            if (!$schedule) {
                return response()->json(['message' => 'Schedule not found.'], 404);
            }

            $schedule->update(['is_active' => false, 'end_date' => now()]);
        }

        // Send one combined notification
        Notification::send($students, new EnrollmentNotification($academicYear, $data['semester'], $isOpen));

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
        $studentRecord = StudentInformation::with(['studentFamilyInfo'])->findOrFail($id);

        if (!$user->hasRole('registrar')) { 
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

        // Get the user and academic year to notify
        $studentInfo = $record->studentInformation;
        $studentUser = $studentInfo?->user;

        $academicYear = $record->enrollmentSchedule?->academicYear;

        if ($studentUser && $academicYear) {
            $studentUser->notify(new EnrollmentStatusNotification('enrolled', $academicYear));
        }

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

        // Notify student about rejection
        $studentInfo = $record->studentInformation;
        $studentUser = $studentInfo?->user;
        $academicYear = $record->enrollmentSchedule?->academicYear;

        if ($studentUser && $academicYear) {
            $studentUser->notify(new EnrollmentStatusNotification('rejected', $academicYear));
        }

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
