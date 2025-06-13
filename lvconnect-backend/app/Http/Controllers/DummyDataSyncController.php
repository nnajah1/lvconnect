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

                $validCivilStatus = ['single', 'married', 'divorced', 'widowed'];
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
                        // Accept both string course name/code or array with course info
                        $courseIdentifier = $gradeData['course'] ?? null;
                        if (is_array($courseIdentifier)) {
                            // If course is an array, try to use 'id', 'course', or 'course_code'
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
                            // If course is a string, try both course name and code
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

                if (!empty($applicant['schedules']) && is_array($applicant['schedules'])) {
                    foreach ($applicant['schedules'] as $scheduleData) {
                        // Ensure $scheduleData is an array
                        if (!is_array($scheduleData)) {
                            \Log::info('Schedule sync: scheduleData is not an array', [
                                'scheduleData' => $scheduleData
                            ]);
                            continue;
                        }

                        $program = Program::where('program_name', $scheduleData['program'] ?? null)->first();

                        // Handle course as array or string
                        $courseIdentifier = $scheduleData['course'] ?? null;
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

                        if (!$program || !$course) {
                            \Log::info('Schedule sync: Program or Course not found', [
                                'program' => $scheduleData['program'] ?? null,
                                'course' => $scheduleData['course'] ?? null
                            ]);
                            continue;
                        }

                        $exists = Schedule::where([
                            'program_id' => $program->id,
                            'course_id' => $course->id,
                            'term' => $scheduleData['term'] ?? null,
                            'year_level' => $scheduleData['year_level'] ?? null,
                            'section' => $scheduleData['section'] ?? null,
                            'day' => $scheduleData['day'] ?? null,
                            'start_time' => $scheduleData['start_time'] ?? null,
                            'end_time' => $scheduleData['end_time'] ?? null,
                        ])->exists();

                        if (!$exists) {
                            Schedule::create([
                                'program_id' => $program->id,
                                'course_id' => $course->id,
                                'term' => $scheduleData['term'] ?? null,
                                'year_level' => $scheduleData['year_level'] ?? null,
                                'section' => $scheduleData['section'] ?? null,
                                'day' => $scheduleData['day'] ?? null,
                                'start_time' => $scheduleData['start_time'] ?? null,
                                'end_time' => $scheduleData['end_time'] ?? null,
                                'room' => $scheduleData['room'] ?? null,
                            ]);
                            \Log::info('Schedule created', [
                                'program_id' => $program->id,
                                'course_id' => $course->id,
                                'term' => $scheduleData['term'] ?? null,
                                'year_level' => $scheduleData['year_level'] ?? null,
                                'section' => $scheduleData['section'] ?? null,
                                'day' => $scheduleData['day'] ?? null,
                                'start_time' => $scheduleData['start_time'] ?? null,
                                'end_time' => $scheduleData['end_time'] ?? null
                            ]);
                        } else {
                            \Log::info('Schedule already exists', [
                                'program_id' => $program->id,
                                'course_id' => $course->id,
                                'term' => $scheduleData['term'] ?? null,
                                'year_level' => $scheduleData['year_level'] ?? null,
                                'section' => $scheduleData['section'] ?? null,
                                'day' => $scheduleData['day'] ?? null,
                                'start_time' => $scheduleData['start_time'] ?? null,
                                'end_time' => $scheduleData['end_time'] ?? null
                            ]);
                        }
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
