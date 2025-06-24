<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentInformation;
use Illuminate\Support\Facades\Http;
use App\Models\StudentFamilyInformation;
use App\Models\Program;
use App\Models\EnrolleeRecord;
use App\Models\EnrollmentSchedule;
use App\Models\Course;
use App\Models\Grade;
use App\Models\GradeTemplate;
use App\Models\Schedule;
use Illuminate\Support\Carbon;
use App\Models\User;

class DummyDataSyncController extends Controller
{
    public function sync()
    {
        try {
            $response = Http::withToken(env('DUMMY_API_TOKEN'))
                ->get(env('DUMMY_API_URL') . '/api/applicants');

            if ($response->failed()) {
                return response()->json(['error' => 'Failed to fetch data from Dummy System'], 500);
            }

            $data = $response->json();

            foreach ($data as $applicant) {
                if (empty($applicant['first_name']) || empty($applicant['last_name'])) {
                    continue;
                }

                $user = User::where('first_name', $applicant['first_name'])
                    ->where('last_name', $applicant['last_name'])
                    ->first();

                if (!$user) {
                    continue;
                }

                $validCivilStatus = ['single', 'married', 'widowed'];
                $civilStatus = strtolower($applicant['marital_status'] ?? 'single');
                if (!in_array($civilStatus, $validCivilStatus)) {
                    $civilStatus = 'single';
                }

                $validGenders = ['male', 'female'];
                $gender = strtolower($applicant['gender'] ?? 'male');
                if (!in_array($gender, $validGenders)) {
                    $gender = 'male';
                }

                try {
                    $birthDate = Carbon::parse($applicant['date_of_birth'])->format('Y-m-d');
                } catch (\Exception $e) {
                    continue;
                }

                $fbLink = $applicant['fb_account'] ?? 'N/A';
                $governmentSubsidy = $applicant['government_subsidy'] ?? 'N/A';
                $zipCode = is_numeric($applicant['zip_code'] ?? null) ? $applicant['zip_code'] : 0;

                $existingStudent = StudentInformation::where('user_id', $user->id)
                    ->where('first_name', $applicant['first_name'])
                    ->where('last_name', $applicant['last_name'])
                    ->first();

                if (!$existingStudent) {
                    $student = StudentInformation::create([
                        'user_id' => $user->id,
                        'student_id_number' => 'STU' . now()->format('Ymd') . rand(100, 999),
                        'first_name'  => $applicant['first_name'],
                        'last_name'   => $applicant['last_name'],
                        'middle_name' => $applicant['middle_name'],
                        'civil_status' => $civilStatus,
                        'gender'       => $gender,
                        'birth_date' => $birthDate,
                        'birth_place' => $applicant['place_of_birth'],
                        'mobile_number' => $applicant['mobile_number'],
                        'religion' => $applicant['religion'],
                        'lrn' => $applicant['lrn_num'],
                        'fb_link' => $fbLink,
                        'government_subsidy' => $governmentSubsidy,
                        'scholarship_status' => 'Full',
                        'last_school_attended' => $applicant['previous_school_name'],
                        'previous_school_address' => $applicant['previous_school_address'],
                        'school_type' => $applicant['type_of_school'],
                        'academic_awards' => $applicant['academic_awards_achievements'],
                        'floor/unit/building_no'=> 'Unit 101',
                        'house_no/street' => $applicant['street'],
                        'barangay' => $applicant['barangay'],
                        'city_municipality' => $applicant['city'],
                        'province' => $applicant['province'],
                        'zip_code' => $zipCode,
                    ]);
                } else {
                    $student = $existingStudent;
                }

                if (isset($applicant['guardian']) && !StudentFamilyInformation::where('student_information_id', $student->id)->exists()) {
                    StudentFamilyInformation::create([
                        'student_information_id' => $student->id,
                        'num_children_in_family' => (int) $applicant['no_of_children'],
                        'birth_order' => (int) $applicant['birth_order'],
                        'has_sibling_in_lvcc' => (bool) $applicant['is_bro_sis_curr_applying_studying'],
                        'mother_first_name'  => $applicant['guardian']['mother_first_name'],
                        'mother_last_name'   => $applicant['guardian']['mother_last_name'],
                        'mother_middle_name' => $applicant['guardian']['mother_middle_name'],
                        'mother_religion' => $applicant['guardian']['mother_religion'],
                        'mother_occupation' => $applicant['guardian']['mother_occupation'],
                        'mother_monthly_income' => $applicant['guardian']['mother_monthly_income'],
                        'mother_mobile_number' => $applicant['guardian']['mother_mobile_number'],
                        'father_first_name'  => $applicant['guardian']['father_first_name'],
                        'father_last_name'   => $applicant['guardian']['father_last_name'],
                        'father_middle_name' => $applicant['guardian']['father_middle_name'],
                        'father_religion' => $applicant['guardian']['father_religion'],
                        'father_occupation' => $applicant['guardian']['father_occupation'],
                        'father_monthly_income' => $applicant['guardian']['father_monthly_income'],
                        'father_mobile_number' => $applicant['guardian']['father_mobile_number'],
                        'guardian_first_name'  => $applicant['guardian']['legal_guardian_first_name'],
                        'guardian_last_name'   => $applicant['guardian']['legal_guardian_last_name'],
                        'guardian_middle_name' => $applicant['guardian']['legal_guardian_middle_name'],
                        'guardian_religion' => $applicant['guardian']['legal_guardian_religion'],
                        'guardian_occupation' => $applicant['guardian']['legal_guardian_occupation'],
                        'guardian_monthly_income' => $applicant['guardian']['legal_guardian_monthly_income'],
                        'guardian_mobile_number' => $applicant['guardian']['legal_guardian_mobile_number'],
                        'guardian_relationship' => $applicant['guardian']['legal_guardian_relationship'],
                    ]);
                }

                if (!empty($applicant['grade_level_course_to_be_taken'])) {
                    $program = Program::where('program_name', $applicant['grade_level_course_to_be_taken'])->first();
                    $activeSchedule = EnrollmentSchedule::where('is_active', true)->first();

                    if ($program && $activeSchedule && !EnrolleeRecord::where('student_information_id', $student->id)->exists()) {
                        EnrolleeRecord::create([
                            'student_information_id' => $student->id,
                            'program_id' => $program->id,
                            'enrollment_schedule_id' => $activeSchedule->id,
                            'year_level' => 1,
                            'privacy_policy' => true,
                            'enrollment_status' => 'enrolled',
                            'admin_remarks' => 'Synced from Dummy System',
                            'submission_date' => now(),
                        ]);
                    }
                }

                if (!empty($applicant['grades']) && is_array($applicant['grades'])) {
                    foreach ($applicant['grades'] as $gradeData) {
                        $courseIdentifier = $gradeData['course'] ?? null;
                        if (is_array($courseIdentifier)) {
                            if (isset($courseIdentifier['id'])) {
                                $course = Course::find($courseIdentifier['id']);
                            } elseif (isset($courseIdentifier['course_code'])) {
                                $course = Course::where('course_code', $courseIdentifier['course_code'])->first();
                            } elseif (isset($courseIdentifier['course'])) {
                                $course = Course::where('course', $courseIdentifier['course'])->first();
                            } else {
                                $course = null;
                            }
                        } else {
                            $course = Course::where('course', $courseIdentifier)
                                ->orWhere('course_code', $courseIdentifier)
                                ->first();
                        }

                        $exists = Grade::where('student_information_id', $student->id)
                            ->where('course_id', $course->id)
                            ->where('term', $gradeData['term'])
                            ->where('academic_year', $gradeData['academic_year'])
                            ->exists();

                        if (!$exists) {
                            Grade::create([
                                'student_information_id' => $student->id,
                                'course_id' => $course->id,
                                'term' => $gradeData['term'],
                                'academic_year' => $gradeData['academic_year'],
                                'grade' => $gradeData['grade'],
                                'remarks' => $gradeData['remarks'],
                            ]);
                        }
                    }
                }

                if (!empty($applicant['grade_template']) && is_array($applicant['grade_template'])) {
                    $template = $applicant['grade_template'];

                    $exists = GradeTemplate::where('student_information_id', $student->id)
                        ->where('term', $template['term'])
                        ->where('school_year', $template['school_year'])
                        ->exists();

                    if (!$exists) {
                        GradeTemplate::create([
                            'student_information_id' => $student->id,
                            'term' => $template['term'],
                            'school_year' => $template['school_year'],
                            'target_GWA' => $template['target_GWA'],
                            'actual_GWA' => $template['actual_GWA'],
                            'status' => $template['status'],
                        ]);
                        \Log::info('GradeTemplate created', [
                            'student_information_id' => $student->id,
                            'term' => $template['term'],
                            'school_year' => $template['school_year']
                        ]);
                    } else {
                        \Log::info('GradeTemplate already exists', [
                            'student_information_id' => $student->id,
                            'term' => $template['term'],
                            'school_year' => $template['school_year']
                        ]);
                    }
                }
            }

            return response()->json(['message' => 'Applicants synced successfully.']);
        } catch (\Throwable $e) {
            \Log::error('Sync error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Sync failed.', 'error' => $e->getMessage()], 500);
        }
    }

    public function syncSchedules()
    {
        try {
            $academicYear = '2024-2025';
            $yearLevelLabels = [
                1 => '1st Year',
                2 => '2nd Year',
                3 => '3rd Year',
                4 => '4th Year',
            ];
            $externalProgramIds = [4, 7, 8, 10, 11, 12];

            $totalInserted = 0;
            $totalSkipped = 0;

            \Log::info('Starting schedule sync', [
                'academic_year' => $academicYear,
                'program_ids' => $externalProgramIds,
                'year_levels' => $yearLevelLabels,
            ]);

            foreach ($externalProgramIds as $programId) {
                foreach ($yearLevelLabels as $yearLevel => $yearLevelStr) {

                    \Log::info('Fetching schedule', [
                        'program_id' => $programId,
                        'year_level' => $yearLevelStr,
                        'academic_year' => $academicYear,
                    ]);

                    $response = Http::withToken(env('SCHEDULE_API_TOKEN'))
                        ->get(env('SCHEDULE_API_URL') . '/api/schedule-management/external/uploaded', [
                            'program_id'    => $programId,
                            'academic_year' => $academicYear,
                            'year_level'    => $yearLevelStr,
                        ]);

                    if ($response->failed()) {
                        \Log::warning("Failed to fetch schedule", [
                            'program_id' => $programId,
                            'year_level' => $yearLevelStr,
                            'status'     => $response->status(),
                            'body'       => $response->body(),
                        ]);
                        continue;
                    }

                    $responseData = $response->json();
                    $scheduleGroups = $responseData['schedules'] ?? null;

                    if (!is_array($scheduleGroups)) {
                        \Log::warning('Missing or invalid schedule_json for entry', [
                            'entry' => $responseData['schedules'] ?? $responseData,
                        ]);
                        continue;
                    }

                    \Log::info('Fetched schedule groups', [
                        'program_id' => $programId,
                        'year_level' => $yearLevelStr,
                        'group_count' => count($scheduleGroups),
                    ]);

                    foreach ($scheduleGroups as $groupIdx => $group) {
                        $semester = $group['semester'] ?? null;
                        $scheduleItems = $group['schedule_json'] ?? [];

                        if (!is_array($scheduleItems)) {
                            \Log::warning('Missing or invalid schedule_json for entry', [
                                'entry' => $group,
                            ]);
                            continue;
                        }

                        \Log::info('Processing schedule group', [
                            'program_id' => $programId,
                            'year_level' => $yearLevelStr,
                            'group_index' => $groupIdx,
                            'semester' => $semester,
                            'item_count' => count($scheduleItems),
                        ]);

                        foreach ($scheduleItems as $itemIdx => $item) {
                            $props = $item['extendedProps'] ?? [];

                            $courseId = $item['course_id'] ?? null;
                            $day = $item['day'] ?? null;
                            $start = $item['start'] ?? null;
                            $end = $item['end'] ?? null;

                            if (!$courseId || !$day || !$start || !$end) {
                                \Log::warning("Missing required schedule data", [
                                    'program_id' => $programId,
                                    'year_level' => $yearLevelStr,
                                    'group_index' => $groupIdx,
                                    'item_index' => $itemIdx,
                                    'course_id' => $courseId,
                                    'day' => $day,
                                    'start' => $start,
                                    'end' => $end,
                                ]);
                                continue;
                            }

                            // Ensure time is in 'H:i:s' format and prepend a valid date for DATETIME columns
                            $dummyDate = '2000-01-01';
                            $startTime = null;
                            $endTime = null;

                            // Validate and format start time
                            if (preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $start)) {
                                $startFormatted = strlen($start) === 5 ? $start . ':00' : $start;
                                $startTime = $dummyDate . ' ' . $startFormatted;
                            } else {
                                \Log::warning('Invalid start time format', [
                                    'start' => $start,
                                ]);
                                continue;
                            }

                            // Validate and format end time
                            if (preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $end)) {
                                $endFormatted = strlen($end) === 5 ? $end . ':00' : $end;
                                $endTime = $dummyDate . ' ' . $endFormatted;
                            } else {
                                \Log::warning('Invalid end time format', [
                                    'end' => $end,
                                ]);
                                continue;
                            }

                            // Final check for valid datetime format
                            if (!preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $startTime) || !preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $endTime)) {
                                \Log::warning('Invalid datetime format for schedule', [
                                    'start_time' => $startTime,
                                    'end_time' => $endTime,
                                    'program_id' => $programId,
                                    'year_level' => $yearLevelStr,
                                    'course_id' => $courseId,
                                    'day' => $day,
                                ]);
                                continue;
                            }

                            $exists = Schedule::where([
                                'course_id'     => $courseId,
                                'program_id'    => $programId,
                                'year_level'    => $yearLevel,
                                'academic_year' => $academicYear,
                                'day'           => $day,
                                'start_time'    => $startTime,
                                'end_time'      => $endTime,
                            ])->exists();

                            if (!$exists) {
                                Schedule::create([
                                    'course_id'     => $courseId,
                                    'program_id'    => $programId,
                                    'year_level'    => $yearLevel,
                                    'academic_year' => $academicYear,
                                    'semester'      => $semester,
                                    'day'           => $day,
                                    'start_time'    => $startTime,
                                    'end_time'      => $endTime,
                                    'room'          => $props['room_name'] ?? null,
                                    'instructor'    => $props['instructor_name'] ?? null,
                                    'course_name'   => $props['course_name'] ?? null,
                                    'course_code'   => $props['course_code'] ?? null,
                                ]);
                                $totalInserted++;
                                \Log::info('Inserted new schedule', [
                                    'program_id' => $programId,
                                    'year_level' => $yearLevel,
                                    'semester' => $semester,
                                    'course_id' => $courseId,
                                    'day' => $day,
                                    'start_time' => $startTime,
                                    'end_time' => $endTime,
                                    'room' => $props['room_name'] ?? null,
                                    'instructor' => $props['instructor_name'] ?? null,
                                    'course_name' => $props['course_name'] ?? null,
                                    'course_code' => $props['course_code'] ?? null,
                                ]);
                            } else {
                                $totalSkipped++;
                                \Log::info('Skipped existing schedule', [
                                    'program_id' => $programId,
                                    'year_level' => $yearLevel,
                                    'semester' => $semester,
                                    'course_id' => $courseId,
                                    'day' => $day,
                                    'start_time' => $startTime,
                                    'end_time' => $endTime,
                                ]);
                            }
                        }
                    }
                }
            }

            \Log::info('Schedule sync completed', [
                'inserted' => $totalInserted,
                'skipped' => $totalSkipped,
            ]);

            return response()->json([
                'message'  => 'Schedules synced successfully.',
                'inserted' => $totalInserted,
                'skipped'  => $totalSkipped,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error during schedule sync', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'error'   => 'An error occurred while syncing schedules.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
