<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SOASeeder extends Seeder
{
    public function run(): void
    {
        $templateId = DB::table('fee_templates')->insertGetId([
            'tuition_per_unit' => 1500.00,
            'total_units' => 18,
            'tuition_total' => 0, // to be updated later
            'miscellaneous_total' => 0, // to be updated later
            'first_term_total' => 0,
            'second_term_total' => 0,
            'whole_academic_year' => 0,
            'scholarship_discount' => 0,
            'total_payment' => 0,
            'status' => 'saved',
            'is_visible' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $miscCategoryId = DB::table('fee_categories')->insertGetId([
            'name' => 'Miscellaneous',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $fees = [
            ['fee_name' => 'Library Fee', 'amount' => 1000],
            ['fee_name' => 'Medical Fee', 'amount' => 800],
            ['fee_name' => 'Athletic Fee', 'amount' => 600],
            ['fee_name' => 'Registration Fee', 'amount' => 600],
        ];

        $miscTotal = 0;

        foreach ($fees as $fee) {
            DB::table('fees')->insert([
                'fee_template_id' => $templateId,
                'fee_category_id' => $miscCategoryId,
                'fee_name' => $fee['fee_name'],
                'amount' => $fee['amount'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $miscTotal += $fee['amount'];
        }

        $tuitionPerUnit = 1500.00;
        $totalUnits = 18;
        $tuitionTotal = $tuitionPerUnit * $totalUnits;
        $firstTermTotal = $tuitionTotal + $miscTotal;
        $secondTermTotal = $tuitionTotal + $miscTotal;
        $wholeAcademicYear = $firstTermTotal + $secondTermTotal;

        DB::table('fee_templates')->where('id', $templateId)->update([
            'tuition_total' => $tuitionTotal,
            'miscellaneous_total' => $miscTotal,
            'first_term_total' => $firstTermTotal,
            'second_term_total' => $secondTermTotal,
            'whole_academic_year' => $wholeAcademicYear,
            'scholarship_discount' => $wholeAcademicYear,
            'total_payment' => 0,
            'updated_at' => now(),
        ]);

        $this->command->info('Fee template, category, and fees seeded successfully!');
    }
}
