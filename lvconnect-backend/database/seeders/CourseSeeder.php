<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
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

        $this->command->info('Courses table seeded successfully.');
    }
}
