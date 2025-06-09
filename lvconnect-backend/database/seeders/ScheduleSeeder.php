<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Schedule;
use App\Models\EnrolleeRecord;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();

        if ($courses->count() < 5) {
            $this->command->warn('Not enough courses to assign. Please seed more courses first.');
            return;
        }

        $yearLevelMap = [
            1 => '1st Year',
            2 => '2nd Year',
            3 => '3rd Year',
            4 => '4th Year',
        ];

        $combinations = EnrolleeRecord::select('program_id', 'year_level')
            ->distinct()
            ->get();

        foreach ($combinations as $combo) {
            $yearLevelString = $yearLevelMap[$combo->year_level] ?? null;

            if (!$yearLevelString) {
                $this->command->warn("Unknown year level: {$combo->year_level}");
                continue;
            }

            $randomCourses = $courses->random(5);

            foreach ($randomCourses as $index => $course) {
                Schedule::create([
                    'program_id' => $combo->program_id,
                    'course_id' => $course->id,
                    'term' => '1st Term',
                    'year_level' => $yearLevelString,
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

        $this->command->info('Schedules seeded for all unique program and year level combinations in enrollee records.');
    }
}
