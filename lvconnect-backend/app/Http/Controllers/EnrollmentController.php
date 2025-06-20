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

        if ($user->hasAnyRole(['student', 'superadmin'])) {
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

        if ($user->hasRole(['registrar', 'superadmin'])) {
            $students = StudentInformation::whereHas('enrolleeRecord', function ($query) use ($academicYear, $semester) {
                $query->where('enrollment_status', '!=', 'archived')
                    ->whereHas('enrollmentSchedule', function ($subQuery) use ($academicYear, $semester) {
                        $subQuery->where('academic_year_id', $academicYear)
                            ->where('semester', $semester);
                    });
            })
                ->with([
                    'enrolleeRecord' => function ($query) use ($academicYear, $semester) {
                        $query->where('enrollment_status', '!=', 'archived')
                            ->whereHas('enrollmentSchedule', function ($subQuery) use ($academicYear, $semester) {
                                $subQuery->where('academic_year_id', $academicYear)
                                    ->where('semester', $semester);
                            })
                            ->with(['enrollmentSchedule', 'program']);
                    }
                ])
                ->get();


            return response()->json($students);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }


    public function showEnrolled()
    {

        $user = JWTAuth::authenticate();

        if ($user->hasAnyRole(['registrar', 'superadmin'])) {
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

            if (!$user->hasAnyRole(['registrar', 'superadmin'])) {
                return response()->json(['message' => 'Unauthorized. Only registrars or superadmins can access this data.'], 403);
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

            // Students who have any enrollee record (any schedule, any status)
            $studentsWithAnyEnrolleeRecord = EnrolleeRecord::whereIn('student_information_id', $studentInformationIds)
                ->pluck('student_information_id')
                ->unique();

            // Students who have an enrollee record for this academic year and semester (status not archived)
            $studentsWithEnrolleeRecord = EnrolleeRecord::whereIn('enrollment_schedule_id', $filteredSchedules)
                ->whereIn('student_information_id', $studentInformationIds)
                ->where('enrollment_status', '!=', 'archived')
                ->pluck('student_information_id')
                ->unique();

            // Students with no enrollee record for this academic year and semester only
            $studentsNotEnrolled = StudentInformation::whereIn('id', $studentInformationIds)
                ->whereNotIn('id', $studentsWithEnrolleeRecord)
                ->get()
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

            if (!$user->hasAnyRole(['student', 'superadmin'])) {
                return response()->json(['message' => 'Unauthorized. Only students or superadmins can enroll.'], 403);
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

            if (!$user->hasAnyRole(['registrar', 'superadmin'])) {
                return response()->json(['message' => 'Unauthorized. Only registrars or superadmins can access this data.'], 403);
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

        if ($user->hasAnyRole(['registrar', 'superadmin'])) {
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

            if (!$user->hasAnyRole(['registrar', 'superadmin'])) {
                return response()->json(['message' => 'Unauthorized. Only registrars or superadmins can perform this action.'], 403);
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

            // Get the latest schedule (even if closed)
            $latestSchedule = EnrollmentSchedule::orderByDesc('created_at')->first();

            if (!$latestSchedule) {
                return response()->json(['message' => 'No enrollment schedule found.'], 422);
            }

            // Only allow enrollment if not already enrolled in this program, year level, and latest schedule
            $alreadyEnrolled = EnrolleeRecord::where('student_information_id', $studentInfo->id)
                ->where('program_id', $validated['program_id'])
                ->where('year_level', $validated['year_level'])
                ->where('enrollment_schedule_id', $latestSchedule->id)
                ->exists();

            if ($alreadyEnrolled) {
                return response()->json(['message' => 'Student is already enrolled for the selected program, year level, and schedule.'], 409);
            }

            DB::transaction(function () use ($validated, $studentInfo, $latestSchedule) {
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

                // Create enrollee record for the latest schedule
                EnrolleeRecord::updateOrCreate(
                    [
                        'enrollment_schedule_id' => $latestSchedule->id,
                        'student_information_id' => $studentInfo->id,
                        'program_id' => $validated['program_id'],
                        'year_level' => $validated['year_level'],
                    ],
                    [
                        'privacy_policy' => $validated['privacy_policy'],
                        'enrollment_status' => 'enrolled',
                        'admin_remarks' => $validated['admin_remarks'] ?? '',
                        'submission_date' => now(),
                    ]
                );

                // Academic year from latest enrollment schedule
                $academicYear = $latestSchedule->academicYear;

                if ($academicYear) {
                    $studentUser = User::findOrFail($validated['user_id']);
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
        $isOpen = $data['is_active'];

        // Fetch students with notification preferences
        $students = User::role('student')->with('notificationPreference')->get();

        // open
        if ($isOpen) {
            // Disable all existing schedules for the same academic year
            EnrollmentSchedule::where('academic_year_id', $data['academic_year_id'])->update(['is_active' => false]);

            // Create or update current schedule
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

        // Send notification to all students
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

        $year = AcademicYear::find($data['academic_year_id']);
        if (!$year || !$year->is_active) {
            return response()->json([
                'message' => 'You can only open a schedule for an active academic year.'
            ], 422);
        }

        // Check 1st semester requirement for opening 2nd semester
        if ($data['semester'] === 'second_semester') {
            $firstExistsAndActive = EnrollmentSchedule::where('academic_year_id', $data['academic_year_id'])
                ->where('semester', 'first_semester')
                ->where('is_active', true)
                ->exists();

            if (!$firstExistsAndActive) {
                return response()->json([
                    'message' => '1st semester must be created before 2nd Semester.'
                ], 422);
            }
        }

        // Now safe to deactivate existing schedules for this academic year
        EnrollmentSchedule::where('academic_year_id', $data['academic_year_id'])
            ->where('is_active', true)
            ->update(['is_active' => false]);

        // Create or update the current semester's schedule
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

        // Notify students who are not yet enrolled
        $studentsToNotify = StudentInformation::whereDoesntHave('enrolleeRecord', function ($query) use ($data) {
            $query->whereHas('enrollmentSchedule', function ($q) use ($data) {
                $q->where('academic_year_id', $data['academic_year_id'])
                    ->where('semester', $data['semester']);
            });
        })->get();

        $userIds = $studentsToNotify->pluck('user_id')->filter()->unique();

        User::whereIn('id', $userIds)->chunk(20, function ($users) use ($year, $data) {
            foreach ($users as $user) {
                $user->notify(new EnrollmentNotification($year, $data['semester'], true));
            }
        });

        return response()->json([
            'message' => "Schedule for academic year {$year->name} and semester {$data['semester']} opened successfully.",
            'data' => $schedule,
        ]);
    }

    public function closeSchedule(Request $request)
    {
        $data = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester' => 'required|in:first_semester,second_semester',
        ]);

        $year = AcademicYear::find($data['academic_year_id']);
        if (!$year) {
            return response()->json(['message' => 'Academic year not found.'], 404);
        }

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

        // Notify students who are not yet enrolled in this schedule
        $studentsToNotify = StudentInformation::whereDoesntHave('enrolleeRecord', function ($query) use ($data) {
            $query->whereHas('enrollmentSchedule', function ($q) use ($data) {
                $q->where('academic_year_id', $data['academic_year_id'])
                    ->where('semester', $data['semester']);
            });
        })->get();

        $userIds = $studentsToNotify->pluck('user_id')->filter()->unique();

        User::whereIn('id', $userIds)->chunk(20, function ($users) use ($year, $data) {
            foreach ($users as $user) {
                $user->notify(new EnrollmentNotification($year, $data['semester'], false));
            }
        });

        return response()->json([
            'data' => $schedule,
            'message' => 'Schedule closed.',
        ]);
    }

    public function getActiveEnrollmentSchedule()
    {
        $activeSchedule = EnrollmentSchedule::with('academicYear')
            ->where('is_active', true)->first();

        if (!$activeSchedule) {
            return response()->json(['active' => false]);
        }

        return response()->json([
            'active' => $activeSchedule,
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
        $headers = ['Student ID', 'First Name', 'Last Name', 'Program', 'Year Level', 'Enrolled At'];
        $csvData .= implode(',', $headers) . "\n";

        foreach ($data as $record) {
            $firstName = $record->studentInfo?->first_name ?? 'N/A';
            $lastName = $record->studentInfo?->last_name ?? 'N/A';
            $year = $record->studentInfo?->year_level ?? 'N/A';
            $program = $record->studentInfo?->program ?? 'N/A';
            $studentId = $record->studentInfo?->student_id_number ?? 'N/A';
            $csvData .= "{$studentId},{$firstName},{$lastName},{$program},{$year},{$record->submission_date}\n";
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

        if (!$user->hasAnyRole(['student', 'registrar', 'superadmin'])) {
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

        if (!$user->hasAnyRole(['registrar', 'superadmin'])) {
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

        if (!$user->hasAnyRole(['registrar', 'superadmin'])) {
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
