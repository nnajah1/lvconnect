<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Schedule;
use App\Models\EnrolleeRecord;
use App\Models\StudentInformation;
use Illuminate\Support\Facades\DB;
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

        // Get distinct combinations of program_id, year_level, and student_information_id
        $records = DB::table('enrollee_records')
            ->select('program_id', 'year_level', 'student_information_id')
            ->distinct()
            ->get();

        // Group combinations by (program_id, year_level, student_type)
        $grouped = [];

        foreach ($records as $record) {
            $studentType = StudentInformation::where('id', $record->student_information_id)->value('student_type') ?? 'default';

            $key = $record->program_id . '|' . $record->year_level . '|' . $studentType;

            // We only need one entry per combination of program, year_level, and student_type
            if (!isset($grouped[$key])) {
                $grouped[$key] = [
                    'program_id' => $record->program_id,
                    'year_level' => $record->year_level,
                    'student_type' => $studentType,
                ];
            }
        }

        foreach ($grouped as $combo) {
            $yearLevelString = $yearLevelMap[$combo['year_level']] ?? null;

            if (!$yearLevelString) {
                $this->command->warn("Unknown year level: {$combo['year_level']}");
                continue;
            }

            $randomCourses = $courses->random(5);

            foreach ($randomCourses as $index => $course) {
                Schedule::create([
                    'program_id' => $combo['program_id'],
                    'course_id' => $course->id,
                    'term' => '1st Term',
                    'year_level' => $yearLevelString,
                    'section' => 'A',
                    'student_type' => $combo['student_type'], // include student_type here
                    'day' => ['Mon/Wed', 'Tue/Thu', 'Friday'][$index % 3],
                    'start_time' => Carbon::createFromTime(8 + $index, 0),
                    'end_time' => Carbon::createFromTime(9 + $index, 0),
                    'room' => 'Room ' . chr(65 + $index),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Schedules seeded for all unique program, year level, and student type combinations.');
    }
}
