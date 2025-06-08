<?php

namespace Database\Seeders;

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

        // Seed Courses 
        if (Course::count() === 0) {
            $courses = [
                ['course' => 'Mathematics', 'unit' => 3, 'course_code' => 'MATH101'],
                ['course' => 'English', 'unit' => 3, 'course_code' => 'ENG101'],
                ['course' => 'Science', 'unit' => 4, 'course_code' => 'SCI101'],
                ['course' => 'History', 'unit' => 3, 'course_code' => 'HIST101'],
                ['course' => 'Physical Education', 'unit' => 2, 'course_code' => 'PE101'],
                ['course' => 'Computer Science', 'unit' => 4, 'course_code' => 'CS101'],
                ['course' => 'Philosophy', 'unit' => 3, 'course_code' => 'PHIL101'],
                ['course' => 'Art', 'unit' => 2, 'course_code' => 'ART101'],
                ['course' => 'Economics', 'unit' => 3, 'course_code' => 'ECON101'],
                ['course' => 'Psychology', 'unit' => 3, 'course_code' => 'PSY101'],
                ['course' => 'Sociology', 'unit' => 3, 'course_code' => 'SOC101'],
                ['course' => 'Biology', 'unit' => 4, 'course_code' => 'BIO101'],
                ['course' => 'Chemistry', 'unit' => 4, 'course_code' => 'CHEM101'],
                ['course' => 'Political Science', 'unit' => 3, 'course_code' => 'POLSCI101'],
                ['course' => 'Environmental Science', 'unit' => 3, 'course_code' => 'ENVSCI101'],
                ['course' => 'Information System', 'unit' => 3, 'course_code' => 'IS101'],
            ];

            foreach ($courses as $course) {
                Course::create($course);
            }
        }

        $courses = Course::all();
        $applicants = StudentInformation::all();

        if ($applicants->isEmpty()) {
            $this->command->warn('No applicant registrations found. Please seed applicants first.');
            return;
        }

        // Seed Grades 
        foreach ($applicants as $applicant) {
            $numCourses = rand(5, 8);
            $randomCourses = $courses->random($numCourses);

            foreach ($randomCourses as $course) {
                $gradeValue = $faker->randomFloat(2, 1.00, 5.00); 

                Grade::create([
                    'applicant_registration_id' => $applicant->id,
                    'course_id' => $course->id,
                    'term' => $faker->randomElement(['1st', '2nd']),
                    'academic_year' => $faker->year() . '-' . ($faker->year() + 1),
                    'grade' => $gradeValue,
                    'remarks' => $gradeValue <= 3.0 ? 'passed' : 'not_passed',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Seed GradeTemplate
            $terms = ['1st', '2nd'];
            foreach ($terms as $term) {
                $targetGWA = $faker->randomFloat(2, 1.00, 3.00);
                $actualGWA = $faker->randomFloat(2, 1.00, 5.00);
                $status = $faker->randomElement(['passed', 'not_passed']);

                GradeTemplate::create([
                    'applicant_registration_id' => $applicant->id,
                    'term' => $term,
                    'school_year' => $faker->year() . '-' . ($faker->year() + 1),
                    'target_GWA' => $targetGWA,
                    'actual_GWA' => $actualGWA,
                    'status' => $status,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Seeded courses, grades, and grade templates successfully.');
    }
}
