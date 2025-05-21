<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            'BSIS',
            'BSA',
            'BAB',
            'BSAIS',
            'BSSW',
            'ACT',
        ];

        $yearLevels = [
            '1st Year',
            '2nd Year',
            '3rd Year',
            '4th Year',
        ];

        foreach ($programs as $program) {
            foreach ($yearLevels as $year) {
                DB::table('programs')->insert([
                    'program_name' => $program,
                    'year_level' => $year,
                    'created_at' => Carbon::now(),
                ]);
            }
        }

        $this->command->info('Programs table seeded successfully with year levels!');
    }
}
