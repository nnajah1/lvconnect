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

        foreach ($programs as $program) {
            DB::table('programs')->insert([
                'program_name' => $program,
                'created_at' => Carbon::now(),
            ]);
        }

        $this->command->info('Programs table seeded successfully!');
    }
}
