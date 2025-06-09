<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EnrolleeRecord;
use App\Models\StudentInformation;
use App\Models\Program;
use App\Models\EnrollmentSchedule;
use Faker\Factory as Faker;
use Illuminate\Support\Arr;

class EnrolleeRecordSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create(20);

        $students = StudentInformation::all();
        $programs = Program::all();
        $schedules = EnrollmentSchedule::all();

        if ($students->isEmpty() || $programs->isEmpty() || $schedules->isEmpty()) {
            $this->command->warn('Missing required data. Please ensure student_information, programs, and enrollment_schedules are seeded.');
            return;
        }

        foreach ($students as $student) {
            EnrolleeRecord::create([
                'student_information_id' => $student->id,
                'program_id' => $programs->random()->id,
                'enrollment_schedule_id' => $schedules->random()->id,
                'year_level' => $faker->numberBetween(1, 4),
                'privacy_policy' => true,
                'enrollment_status' => Arr::random(['pending', 'enrolled', 'rejected', 'archived']),
                'admin_remarks' => Arr::random(['Did not Maintain Grades', 'Graduated', 'Drop', 'Transferred']) ?? 'No remarks',
                'submission_date' => $faker->dateTimeBetween('-1 year', 'now'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Enrollee records seeded successfully!');
    }
}
