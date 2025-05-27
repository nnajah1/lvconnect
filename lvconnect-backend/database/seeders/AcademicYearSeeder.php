<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;

class AcademicYearSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $years = [];
        $currentYear = now()->year;

        for ($i = 0; $i < 5; $i++) {
            $start = $currentYear - (4 - $i);
            $end = $start + 1;
            $years[] = [
                'school_year' => "$start-$end",
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Randomize or ensure latest year is active
        $years[count($years) - 1]['is_active'] = true;

        DB::table('academic_years')->insert($years);

        $this->command->info('Academic years seeded successfully!');
    }
}
