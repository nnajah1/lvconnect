<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Schedule;
use App\Models\Course;
use Carbon\Carbon;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $programs = ['BSIS', 'BSA', 'BAB', 'BSAIS', 'BSSW', 'ACT'];
        $courses = Course::all();

        if ($courses->count() < 5) {
            $this->command->warn('Not enough courses to assign. Please seed more courses first.');
            return;
        }

        foreach ($programs as $program) {
            $randomCourses = $courses->random(5);

            foreach ($randomCourses as $index => $course) {
                Schedule::create([
                    'program' => $program,
                    'course_id' => $course->id,
                    'term' => '1st Term',
                    'year_level' => '1st Year',
                    'section' => 'A',
                    'day' => ['Mon/Wed', 'Tue/Thu', 'Friday'][$index % 3],
                    'start_time' => Carbon::createFromTime(8 + $index, 0),
                    'end_time' => Carbon::createFromTime(9 + $index, 0),
                    'room' => 'Room ' . chr(65 + $index), 
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Schedules seeded successfully for each program.');
    }
}
