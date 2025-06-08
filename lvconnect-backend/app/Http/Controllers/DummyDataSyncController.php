<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentInformation;
use Illuminate\Support\Facades\Http;
use App\Models\StudentFamilyInformation;
use App\Models\Program;
use App\Models\EnrolleeRecord;
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
                // Skip if first_name or last_name is missing
                if (empty($applicant['first_name']) || empty($applicant['last_name'])) {
                    continue;
                }

                // Find matching user by first_name and last_name only
                $user = User::where('first_name', $applicant['first_name'])
                    ->where('last_name', $applicant['last_name'])
                    ->first();

                if (!$user) {
                    continue;
                }

                // Validate and normalize civil_status
                $validCivilStatus = ['single', 'married', 'divorced', 'widowed'];
                $civilStatus = strtolower($applicant['marital_status'] ?? 'single');
                if (!in_array($civilStatus, $validCivilStatus)) {
                    $civilStatus = 'single';
                }

                // Validate and normalize gender
                $validGenders = ['male', 'female'];
                $gender = strtolower($applicant['gender'] ?? 'male');
                if (!in_array($gender, $validGenders)) {
                    $gender = 'male';
                }

                // Parse date safely
                try {
                    $birthDate = Carbon::parse($applicant['date_of_birth'])->format('Y-m-d');
                } catch (\Exception $e) {
                    continue;
                }

                // Set defaults for optional values
                $fbLink = $applicant['fb_account'] ?? 'N/A';
                $governmentSubsidy = $applicant['government_subsidy'] ?? 'N/A';
                $zipCode = is_numeric($applicant['zip_code'] ?? null) ? $applicant['zip_code'] : 0;

                // Now safe to insert/update
                $student = StudentInformation::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'first_name'  => $applicant['first_name'],
                        'last_name'   => $applicant['last_name'],
                    ],
                    [
                        'student_id_number' => 'STU' . now()->format('Ymd') . rand(100, 999),
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
                        'last_school_attended' => $applicant['previous_school_name'],
                        'previous_school_address' => $applicant['previous_school_address'],
                        'school_type' => $applicant['type_of_school'],
                        'academic_awards' => $applicant['academic_awards_achievements'],
                        'house_no/street' => $applicant['street'],
                        'barangay' => $applicant['barangay'],
                        'city_municipality' => $applicant['city'],
                        'province' => $applicant['province'],
                        'zip_code' => $zipCode,
                    ]
                );

                // Save or update family information if guardian exists
                if (isset($applicant['guardian'])) {
                    StudentFamilyInformation::updateOrCreate(
                        [
                            'student_information_id' => $student->id,
                        ],
                        [
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
                        ]
                    );
                }

                // Sync only program_id in enrollee_records
                if (!empty($applicant['grade_level_course_to_be_taken'])) {
                    $program = Program::where('program_name', $applicant['grade_level_course_to_be_taken'])->first();

                    if ($program) {
                        EnrolleeRecord::updateOrCreate(
                            [
                                'student_information_id' => $student->id,
                            ],
                            [
                                'program_id' => $program->id,
                                'year_level' => 1,
                            ]
                        );
                    }
                }

                // Sync Courses and Grades
                if (!empty($applicant['grades']) && is_array($applicant['grades'])) {
                    foreach ($applicant['grades'] as $gradeData) {
                        if (
                            empty($gradeData['course']) ||
                            !isset($gradeData['grade']) ||
                            empty($gradeData['term']) ||
                            empty($gradeData['academic_year'])
                        ) {
                            continue;
                        }

                        $course = Course::firstOrCreate(
                            ['course' => $gradeData['course']],
                            [
                                'unit' => $gradeData['unit'] ?? 0,
                                'course_code' => $gradeData['course_code'] ?? null,
                            ]
                        );

                        if (!$course || !isset($course->id)) {
                            continue;
                        }

                        Grade::updateOrCreate(
                            [
                                'student_information_id' => $student->id,
                                'course_id' => $course->id,
                                'term' => (string) $gradeData['term'],
                                'academic_year' => (string) $gradeData['academic_year'],
                            ],
                            [
                                'grade' => is_numeric($gradeData['grade']) ? $gradeData['grade'] : null,
                                'remarks' => $gradeData['remarks'] ?? null,
                            ]
                        );
                    }
                }

                // Sync GradeTemplate
                if (!empty($applicant['grade_template']) && is_array($applicant['grade_template'])) {
                    $template = $applicant['grade_template'];

                    GradeTemplate::updateOrCreate(
                        [
                            'student_information_id' => $student->id,
                            'term' => $template['term'] ?? null,
                            'school_year' => $template['school_year'] ?? null,
                        ],
                        [
                            'target_GWA' => isset($template['target_GWA']) ? (float) $template['target_GWA'] : null,
                            'actual_GWA' => isset($template['actual_GWA']) ? (float) $template['actual_GWA'] : null,
                            'status' => $template['status'] ?? null,
                        ]
                    );
                }

                // Sync Schedules
                if (!empty($applicant['schedules']) && is_array($applicant['schedules'])) {
                    foreach ($applicant['schedules'] as $scheduleData) {
                        // Skip if any required field is missing
                        if (
                            empty($scheduleData['program']) ||
                            empty($scheduleData['course']) ||
                            empty($scheduleData['term']) ||
                            empty($scheduleData['year_level']) ||
                            empty($scheduleData['section']) ||
                            empty($scheduleData['day']) ||
                            empty($scheduleData['start_time']) ||
                            empty($scheduleData['end_time'])
                        ) {
                            continue;
                        }

                        $program = Program::where('program_name', $scheduleData['program'])->first();
                        $course = Course::where('course', $scheduleData['course'])->first();

                        if (!$program || !$course) {
                            continue;
                        }

                        Schedule::updateOrCreate(
                            [
                                'program_id' => $program->id,
                                'course_id' => $course->id,
                                'term' => $scheduleData['term'],
                                'year_level' => $scheduleData['year_level'],
                                'section' => $scheduleData['section'],
                                'day' => $scheduleData['day'],
                                'start_time' => $scheduleData['start_time'],
                                'end_time' => $scheduleData['end_time'],
                            ],
                            [
                                'room' => $scheduleData['room'] ?? null,
                            ]
                        );
                    }
                }

            }

            return response()->json(['message' => 'Applicants synced successfully.']);

        } catch (\Throwable $e) {
            \Log::error('Sync error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Sync failed.', 'error' => $e->getMessage()], 500);
        }
    }
}
