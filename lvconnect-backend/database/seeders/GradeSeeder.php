<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\EnrollmentSchedule;
use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Grade;
use App\Models\GradeTemplate;
use App\Models\StudentInformation;
use Faker\Factory as Faker;

class GradeSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $courses = Course::all();
        $applicants = StudentInformation::all();

        // Get all academic years
        $academicYears = AcademicYear::pluck('school_year');

        if ($courses->isEmpty()) {
            $this->command->warn('No courses found. Please run CourseSeeder first.');
            return;
        }

        if ($applicants->isEmpty()) {
            $this->command->warn('No applicant registrations found. Please seed applicants first.');
            return;
        }

        if ($academicYears->isEmpty()) {
            $this->command->warn('No academic years found in EnrollmentSchedule.');
            return;
        }

        // Use only one academic year for all grades (e.g., the latest)
        $academicYear = $academicYears->last();

        foreach ($applicants as $applicant) {
            $numCourses = rand(5, 8);
            $randomCourses = $courses->random($numCourses);

            foreach ($randomCourses as $course) {
                foreach (['1st', '2nd'] as $term) {
                    $gradeValue = $faker->randomFloat(2, 1.00, 5.00);

                    Grade::create([
                        'student_information_id' => $applicant->id,
                        'course_id' => $course->id,
                        'term' => $term,
                        'academic_year' => $academicYear,
                        'grade' => $gradeValue,
                        'remarks' => $gradeValue <= 3.0 ? 'passed' : 'not_passed',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            foreach (['1st', '2nd'] as $term) {
                $targetGWA = $faker->randomFloat(2, 1.00, 3.00);
                $actualGWA = $faker->randomFloat(2, 1.00, 5.00);
                $status = $faker->randomElement(['passed', 'not_passed']);

                GradeTemplate::create([
                    'student_information_id' => $applicant->id,
                    'term' => $term,
                    'school_year' => $academicYear,
                    'target_GWA' => $targetGWA,
                    'actual_GWA' => $actualGWA,
                    'status' => $status,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Seeded grades and grade templates successfully.');
    }
}
