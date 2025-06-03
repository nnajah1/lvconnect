<?php

namespace App\Http\Controllers;

use App\Models\EnrolleeRecord;
use App\Models\EnrollmentSchedule;
use App\Models\StudentInformation;
use App\Models\AcademicYear;
use App\Models\User;
use App\Models\StudentFamilyInformation;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Response;
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
            $studentInfoId = $user->studentInformation?->id;

            if (!$studentInfoId) {
                return response()->json(['message' => 'Student information not found.'], 404);
            }

            // Get active enrollment schedule with student's enrollee records and their program
            $activeSchedule = EnrollmentSchedule::where('is_active', true)
                ->with([
                    'academicYear',
                    'enrollees' => function ($q) use ($studentInfoId) {
                        $q->where('student_information_id', $studentInfoId)
                            ->with('program');
                    }
                ])
                ->first();

            // Get all enrollee records for the student across all schedules
            $allEnrollees = EnrolleeRecord::where('student_information_id', $studentInfoId)
                ->with(['program', 'enrollmentSchedule.academicYear'])
                ->get();

            if (!$activeSchedule) {
                return response()->json([
                    'message' => 'No active enrollment schedule found.'
                ], 404);
            }

            return response()->json([
                'data' => $activeSchedule,
                'all_enrollees' => $allEnrollees,
                'student_id' => $studentInfoId,
            ]);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }


    public function AdminView(Request $request)
    {
        $user = JWTAuth::authenticate();

        $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester' => 'required|in:first_semester,second_semester',
        ]);

        $academicYear = $request->input('academic_year_id');
        $semester = $request->input('semester');

        if ($user->hasRole('registrar')) {
            $students = StudentInformation::with([
                'enrolleeRecord.enrollmentSchedule' => function ($query) use ($academicYear, $semester) {
                    if ($academicYear) {
                        $query->where('academic_year_id', $academicYear);
                    }
                    if ($semester) {
                        $query->where('semester', $semester);
                    }
                },
                'enrolleeRecord.program',
            ])
                ->whereHas('enrolleeRecord', function ($query) {
                    $query->where('enrollment_status', '!=', 'archived');
                })
                ->whereHas('enrolleeRecord.enrollmentSchedule', function ($query) use ($academicYear, $semester) {
                    if ($academicYear) {
                        $query->where('academic_year_id', $academicYear);
                    }
                    if ($semester) {
                        $query->where('semester', $semester);
                    }
                })
                ->get();

            return response()->json($students);
        }

        return response()->json(['message' => 'Unauthorized'], 403);

    }

    public function showEnrolled()
    {

        $user = JWTAuth::authenticate();

        if ($user->hasRole('registrar')) {
            return StudentInformation::with('enrolleeRecord')
                ->whereHas('enrolleeRecord', function ($query) {
                    $query->where('enrollment_status', 'enrolled');
                })
                ->get();
        }

        return response()->json(['message' => 'Unauthorized'], 403);

    }
    public function getStudentsWithoutEnrollment(Request $request)
    {
        try {
            $user = JWTAuth::authenticate();

            if (!$user->hasRole('registrar')) {
                return response()->json(['message' => 'Unauthorized. Only registrars can access this data.'], 403);
            }

            $request->validate([
                'academic_year_id' => 'required|exists:academic_years,id',
                'semester' => 'required|in:first_semester,second_semester',
            ]);

            $academicYearId = $request->input('academic_year_id');
            $semester = $request->input('semester');

            // Get student user IDs via Spatie
            $studentUserIds = User::role('student')->pluck('id');

            // Get StudentInformation IDs linked to student users
            $studentInformationIds = StudentInformation::whereIn('user_id', $studentUserIds)
                ->pluck('id');

            // Get schedule IDs for the requested year & semester
            $filteredSchedules = EnrollmentSchedule::where('academic_year_id', $academicYearId)
                ->where('semester', $semester)
                ->pluck('id');

            if ($filteredSchedules->isEmpty()) {
                return response()->json(['message' => 'No schedules found for the given academic year and semester.'], 404);
            }

            // Students enrolled or pending in this schedule
            $studentsEnrolledInThisSchedule = EnrolleeRecord::whereIn('enrollment_schedule_id', $filteredSchedules)
                ->whereIn('enrollment_status', ['enrolled', 'pending'])
                ->whereIn('student_information_id', $studentInformationIds)
                ->pluck('student_information_id')
                ->unique();

            // Students enrolled or pending in other schedules
            $studentsEnrolledInOtherSchedules = EnrolleeRecord::whereNotIn('enrollment_schedule_id', $filteredSchedules)
                ->whereIn('enrollment_status', ['enrolled', 'pending'])
                ->whereIn('student_information_id', $studentInformationIds)
                ->pluck('student_information_id')
                ->unique();

            // Students with no enrollment in this or other schedules
            $studentsNotEnrolled = StudentInformation::whereIn('id', $studentInformationIds)
                ->whereNotIn('id', $studentsEnrolledInThisSchedule)
                ->get()
                ->filter(function ($student) use ($studentsEnrolledInOtherSchedules) {
                    return !$studentsEnrolledInOtherSchedules->contains($student->id);
                })
                ->map(function ($student) {
                    return [
                        'id' => $student->id,
                        'student_id' => $student->student_id_number,
                        'name' => $student->full_name,
                        'enrollment_status' => 'not_enrolled',
                    ];
                })
                ->values();

            return response()->json([
                'academic_year' => $academicYearId,
                'semester' => $semester,
                'students' => $studentsNotEnrolled,
            ]);
        } catch (ValidationException $ve) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $ve->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching students.',
                'error' => $e->getMessage(),
            ], 500);
        }
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
                'privacy_policy' => 'required|boolean',
                'address' => 'required|array',
                'mobile_number' => 'required|string',
                'guardian' => 'required|array',
                'mother' => 'required|array',
                'father' => 'required|array',
                'student_id_number' => 'required|string|max:50',
                'fb_link' => 'nullable|url',
                'num_children_in_family' => 'required|integer|min:1',
                'birth_order' => 'required|integer|min:1',
                'has_sibling_in_lvcc' => 'required|boolean',
                'last_school_attended' => 'required|string|max:255',
                'previous_school_address' => 'required|string|max:255',
                'school_type' => 'required|string|max:255',
                'year_level' => 'required|integer|min:1|max:6',
                'civil_status' => 'required|in:single,married,divorced,widowed',
            ], [
                'program_id.required' => 'Program is required.',
                'program_id.exists' => 'Selected program is invalid.',
                'privacy_policy.required' => 'You must agree to the privacy policy.',
                'address.required' => 'Address is required.',
                'mobile_number.required' => 'Mobile number is required.',
                'guardian.required' => 'Guardian information is required.',
                'mother.required' => 'Mother information is required.',
                'father.required' => 'Father information is required.',
                'student_id_number.required' => 'Student ID number is required.',
                'fb_link.url' => 'Facebook link must be a valid URL.',
                'num_children_in_family.required' => 'Number of children in the family is required.',
                'birth_order.required' => 'Birth order is required.',
                'has_sibling_in_lvcc.required' => 'Please specify if you have a sibling in LVCC.',
                'last_school_attended.required' => 'Last school attended is required.',
                'previous_school_address.required' => 'Previous school address is required.',
                'school_type.required' => 'School type is required.',
                'year_level.max' => 'Year level cannot exceed 6.',
                'civil_status' => 'Civil Status is required.',
            ]);

            $studentInfo = StudentInformation::where('user_id', $user->id)->first();

            if (!$studentInfo) {
                return response()->json(['message' => 'Student information not found.'], 404);
            }

            $alreadyEnrolled = EnrolleeRecord::where('student_information_id', $studentInfo->id)
                ->where('program_id', $validated['program_id'])
                ->whereHas('enrollmentSchedule', function ($query) {
                    $query->where('is_active', true);
                })
                ->exists();


            if ($alreadyEnrolled) {
                return response()->json(['message' => 'You have already submitted an enrollment for this program.'], 409);
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
                    'last_school_attended' => $validated['last_school_attended'] ?? $studentInfo->last_school_attended,
                    'previous_school_address' => $validated['previous_school_address'] ?? $studentInfo->previous_school_address,
                    'school_type' => $validated['school_type'] ?? $studentInfo->school_type,
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
                        'num_children_in_family' => $validated['num_children_in_family'],
                        'birth_order' => $validated['birth_order'],
                        'has_sibling_in_lvcc' => $validated['has_sibling_in_lvcc'],
                    ]
                );

                $currentSchedule = EnrollmentSchedule::where('is_active', true)->first();
                EnrolleeRecord::create([
                    'enrollment_schedule_id' => $currentSchedule->id,
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
    public function directEnrollButton(Request $request)
    {
        try {
            $user = JWTAuth::authenticate();

            if (!$user->hasRole('registrar')) {
                return response()->json(['message' => 'Unauthorized. Only registrars can access this data.'], 403);
            }

            $request->validate([
                'student_information_id' => 'required|exists:student_information,id',
            ]);

            // confirm the student exists 
            $student = StudentInformation::findOrFail($request->student_information_id);

            return response()->json([
                'message' => 'Student found.',
                'student_id' => $student->id,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving student.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show Information for pre-filled enrollment for student and registrar.
     */
    public function showEnrollmentData(Request $request)
    {
        $user = JWTAuth::authenticate();

        $targetUserId = $user->id;

        if ($user->hasRole('registrar')) {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
            ]);

            $targetUserId = $validated['user_id'];
        }

        $studentInfo = StudentInformation::where('user_id', $targetUserId)
            ->with('guardian')
            ->first();

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
        try {
            $user = JWTAuth::authenticate();

            if (!$user->hasRole('registrar')) {
                return response()->json(['message' => 'Unauthorized. Only registrars can perform this action.'], 403);
            }

            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'program_id' => 'required|exists:programs,id',
                'year_level' => 'required|integer|min:1',
                'privacy_policy' => 'required|boolean',
                'contact_number' => 'nullable|string',
                'fb_link' => 'nullable|string|max:255',
                'address' => 'nullable|array',
                'mobile_number' => 'nullable|string',
                'student_id_number' => 'nullable|string|max:50',
                'guardian' => 'nullable|array',
                'mother' => 'nullable|array',
                'father' => 'nullable|array',
                'num_children_in_family' => 'nullable|integer|min:1',
                'birth_order' => 'nullable|integer|min:1',
                'has_sibling_in_lvcc' => 'nullable|boolean',
                'last_school_attended' => 'nullable|string|max:255',
                'previous_school_address' => 'nullable|string|max:255',
                'school_type' => 'nullable|string|max:255',
                'admin_remarks' => 'nullable|string',
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

            DB::transaction(function () use ($validated, $studentInfo) {
                // Update StudentInformation
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
                    'num_children_in_family' => $validated['num_children_in_family'] ?? $studentInfo->num_children_in_family,
                    'birth_order' => $validated['birth_order'] ?? $studentInfo->birth_order,
                    'has_sibling_in_lvcc' => $validated['has_sibling_in_lvcc'] ?? $studentInfo->has_sibling_in_lvcc,
                    'last_school_attended' => $validated['last_school_attended'] ?? $studentInfo->last_school_attended,
                    'previous_school_address' => $validated['previous_school_address'] ?? $studentInfo->previous_school_address,
                    'school_type' => $validated['school_type'] ?? $studentInfo->school_type,
                ]);

                // Update or create guardian/family info
                if (!empty($validated['guardian']) || !empty($validated['mother']) || !empty($validated['father'])) {
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
                            'mother_religion' => $validated['mother']['religion'] ?? null,
                            'mother_occupation' => $validated['mother']['occupation'] ?? null,
                            'mother_monthly_income' => $validated['mother']['monthly_income'] ?? null,
                            'mother_mobile_number' => $validated['mother']['mobile_number'] ?? null,
                            'father_religion' => $validated['father']['religion'] ?? null,
                            'father_occupation' => $validated['father']['occupation'] ?? null,
                            'father_monthly_income' => $validated['father']['monthly_income'] ?? null,
                            'father_mobile_number' => $validated['father']['mobile_number'] ?? null,
                            'num_children_in_family' => $validated['num_children_in_family'] ?? null,
                            'birth_order' => $validated['birth_order'] ?? null,
                            'has_sibling_in_lvcc' => $validated['has_sibling_in_lvcc'] ?? null,
                        ]
                    );
                }


                $currentSchedule = EnrollmentSchedule::where('is_active', true)->first();

                if (!$currentSchedule) {
                    return response()->json(['message' => 'No active enrollment schedule found'], 422);
                }

                // Create enrollee record
                EnrolleeRecord::create([
                    'enrollment_schedule_id' => $currentSchedule->id,
                    'student_information_id' => $studentInfo->id,
                    'program_id' => $validated['program_id'],
                    'year_level' => $validated['year_level'],
                    'privacy_policy' => $validated['privacy_policy'],
                    'enrollment_status' => 'enrolled',
                    'admin_remarks' => $validated['admin_remarks'] ?? '',
                    'submission_date' => now(),
                ]);

                // Academic year from latest enrollment schedule
                $academicYear = EnrollmentSchedule::with('academicYear')
                    ->latest()
                    ->first()
                        ?->academicYear;

                if ($academicYear) {
                    $studentUser = User::find($validated['user_id']);
                    if ($studentUser) {
                        $studentUser->notify(new EnrollmentStatusNotification('enrolled', $academicYear));
                    }
                }
            });

            return response()->json(['message' => 'Student enrolled successfully.']);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to enroll student.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Open and Close Enrollment
     */
    public function toggleEnrollmentSchedule(Request $request)
    {
        $data = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester' => 'required|in:first_semester,second_semester',
            'is_active' => 'required|boolean',
        ]);

        if ($data['semester'] === 'second_semester') {
            $firstSemesterExists = EnrollmentSchedule::where('academic_year_id', $data['academic_year_id'])
                ->where('semester', 'first_semester')
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

    public function openSchedule(Request $request)
    {
        $data = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester' => 'required|in:first_semester,second_semester',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        if ($data['semester'] === 'second_semester') {
            $firstExists = EnrollmentSchedule::where('academic_year_id', $data['academic_year_id'])
                ->where('semester', 'first_semester')
                ->exists();

            if (!$firstExists) {
                return response()->json(['message' => '1st semester must be created before 2nd.'], 422);
            }
        }

        EnrollmentSchedule::where('academic_year_id', $data['academic_year_id'])
            ->update(['is_active' => false]);

        $schedule = EnrollmentSchedule::updateOrCreate(
            [
                'academic_year_id' => $data['academic_year_id'],
                'semester' => $data['semester'],
            ],
            [
                'is_active' => true,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
            ]
        );

        Notification::send(User::role('student')->get(), new EnrollmentNotification(
            AcademicYear::find($data['academic_year_id']),
            $data['semester'],
            true
        ));

        return response()->json(['data' => $schedule, 'message' => 'Schedule opened.']);
    }

    public function closeSchedule(Request $request)
    {
        $data = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester' => 'required|in:first_semester,second_semester',
        ]);

        $schedule = EnrollmentSchedule::where('academic_year_id', $data['academic_year_id'])
            ->where('semester', $data['semester'])
            ->first();

        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found.'], 404);
        }

        $schedule->update([
            'is_active' => false,
            'end_date' => now(),
        ]);

        Notification::send(User::role('student')->get(), new EnrollmentNotification(
            AcademicYear::find($data['academic_year_id']),
            $data['semester'],
            false
        ));

        return response()->json(['data' => $schedule, 'message' => 'Schedule closed.']);
    }

    public function getActiveEnrollmentSchedule()
    {
        $activeSchedule = EnrollmentSchedule::where('is_active', true)->first();

        if (!$activeSchedule) {
            return response()->json(['active' => false]);
        }

        return response()->json([
            'active' => true,
            'data' => $activeSchedule,
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
        $data = EnrolleeRecord::with('studentInfo')
            ->whereIn('id', $ids)
            ->get();

        $csvData = '';
        $headers = ['ID', 'First Name', 'Last Name', 'Status']; // updated headers
        $csvData .= implode(',', $headers) . "\n";

        foreach ($data as $record) {
            $firstName = $record->studentInfo?->first_name ?? 'N/A';
            $lastName = $record->studentInfo?->last_name ?? 'N/A';
            $csvData .= "{$record->id},{$firstName},{$lastName},{$record->enrollment_status}\n";
        }


        return Response::make($csvData, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="enrollees.csv"',
        ]);
    }

    public function bulkRemind(Request $request)
    {
        $studentIds = $request->input('ids');
        $scheduleId = $request->input('enrollment_schedule_id');

        $schedule = EnrollmentSchedule::with('academicYear')->findOrFail($scheduleId);

        // Fetch students NOT enrolled in this schedule
        $studentsToRemind = StudentInformation::whereIn('id', $studentIds)
            ->whereDoesntHave('enrolleeRecord', function ($query) use ($scheduleId) {
                $query->where('enrollment_schedule_id', $scheduleId);
            })
            ->get();

        foreach ($studentsToRemind as $student) {
            if ($student->user) {
                $student->user->notify(
                    new EnrollmentStatusNotification('not_enrolled', $schedule->academicYear)
                );
            }
        }

        return response()->json(['message' => 'Reminders sent.']);
    }

    public function bulkRemindRejected(Request $request)
    {
        $studentIds = $request->input('ids');
        $scheduleId = $request->input('enrollment_schedule_id');

        $schedule = EnrollmentSchedule::with('academicYear')->findOrFail($scheduleId);

        // Fetch students who were rejected for this specific enrollment schedule
        $studentsToRemind = StudentInformation::whereIn('id', $studentIds)
            ->whereHas('enrolleeRecord', function ($query) use ($scheduleId) {
                $query->where('enrollment_status', 'rejected')
                    ->where('enrollment_schedule_id', $scheduleId);
            })
            ->get();

        // Notify each student's associated user
        foreach ($studentsToRemind as $student) {
            if ($student->user) {
                $student->user->notify(
                    new EnrollmentStatusNotification('remind_rejected', $schedule->academicYear)
                );
            }
        }

        return response()->json(['message' => 'Reminders sent.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = JWTAuth::authenticate();
        $studentRecord = StudentInformation::with(['studentFamilyInfo', 'user:id,email,avatar', 'enrolleeRecord.program'])->findOrFail($id);

        if (!$user->hasRole(['student', 'registrar'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($studentRecord);
    }

    public function showEnrollmentSchedule(Request $request)
    {
        $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester' => 'required|in:first_semester,second_semester',
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
