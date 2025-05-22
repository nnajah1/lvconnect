<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\AcademicYear;
use Carbon\Carbon;
use Faker\Factory as Faker;

class EnrollmentScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $academicYears = AcademicYear::all();

        if ($academicYears->isEmpty()) {
            $this->command->warn('No academic years found. Please run AcademicYearSeeder first.');
            return;
        }

        foreach ($academicYears as $index => $year) {
            // 1st semester
            $startDate1 = $faker->dateTimeBetween('-2 years', '-1 years');
            $endDate1 = (clone $startDate1)->modify('+3 months');

            // 2nd semester
            $startDate2 = (clone $endDate1)->modify('+1 week');
            $endDate2 = (clone $startDate2)->modify('+3 months');

            DB::table('enrollment_schedules')->insert([
                [
                    'academic_year_id' => $year->id,
                    'semester' => '1st_semester',
                    'is_active' => false,
                    'start_date' => $startDate1->format('Y-m-d'),
                    'end_date' => $endDate1->format('Y-m-d'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'academic_year_id' => $year->id,
                    'semester' => 'second_semester',
                    'is_active' => false,
                    'start_date' => $startDate2->format('Y-m-d'),
                    'end_date' => $endDate2->format('Y-m-d'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ]);
        }

        // Set the most recent 2nd semester schedule as active
        $latestYear = AcademicYear::latest('school_year')->first();
        DB::table('enrollment_schedules')
            ->where('academic_year_id', $latestYear->id)
            ->where('semester', 'second_semester')
            ->update(['is_active' => true]);

        $this->command->info('Enrollment schedules seeded successfully!');
    }
}
