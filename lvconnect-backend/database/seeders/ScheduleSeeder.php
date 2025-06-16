<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Schedule;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        // $courses = Course::all();

        // if ($courses->count() < 5) {
        //     $this->command->warn('Not enough courses to assign. Please seed more courses first.');
        //     return;
        // }

        // $records = DB::table('enrollee_records')
        //     ->select('program_id', 'year_level')
        //     ->distinct()
        //     ->get();

        // $grouped = [];

        // foreach ($records as $record) {
        //     $key = $record->program_id . '|' . $record->year_level;

        //     if (!isset($grouped[$key])) {
        //         $grouped[$key] = [
        //             'program_id' => $record->program_id,
        //             'year_level' => $record->year_level, 
        //         ];
        //     }
        // }

        // foreach ($grouped as $combo) {
        //     $randomCourses = $courses->random(10);

        //     foreach ($randomCourses as $index => $course) {
        //         Schedule::create([
        //             'program_id' => $combo['program_id'],
        //             'course_id' => $course->id,
        //             'term' => '1st Term',
        //             'year_level' => $combo['year_level'],
        //             'section' => 'A',
        //             'day' => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][$index % 7],
        //             'start_time' => Carbon::createFromTime(8 + $index, 0),
        //             'end_time' => Carbon::createFromTime(9 + $index, 0),
        //             'room' => 'Room ' . chr(65 + $index),
        //             'created_at' => now(),
        //             'updated_at' => now(),
        //         ]);
        //     }
        // }

        // $this->command->info('Schedules seeded for each unique (program_id, year_level).');
    }
}
