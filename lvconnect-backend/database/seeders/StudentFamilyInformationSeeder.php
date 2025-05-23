<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StudentFamilyInformation;
use App\Models\StudentInformation;
use Faker\Factory as Faker;

class StudentFamilyInformationSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $students = StudentInformation::all();

        if ($students->isEmpty()) {
            $this->command->warn('No student information found. Skipping StudentFamilyInformationSeeder.');
            return;
        }

        foreach ($students as $student) {
            StudentFamilyInformation::create([
                'student_information_id' => $student->id,
                'num_children_in_family' => $faker->numberBetween(1, 6),
                'birth_order' => $faker->numberBetween(1, 6),
                'has_sibling_in_lvcc' => $faker->boolean,
                'mother_first_name' => $faker->firstNameFemale,
                'mother_middle_name' => $faker->firstNameFemale,
                'mother_last_name' => $faker->lastName,
                'mother_religion' => $faker->randomElement(['Catholic', 'Christian', 'Muslim', 'MCGI']),
                'mother_occupation' => $faker->jobTitle,
                'mother_monthly_income' => $faker->randomElement(["Below ₱10,000", "₱10,000 - ₱20,000", "₱20,001 - ₱30,000", "₱30,001 - ₱40,000"]),
                'mother_mobile_number' => $faker->phoneNumber,
                'father_first_name' => $faker->firstNameMale,
                'father_middle_name' => $faker->firstNameMale,
                'father_last_name' => $faker->lastName,
                'father_religion' => $faker->randomElement(['Catholic', 'Christian', 'Muslim', 'MCGI']),
                'father_occupation' => $faker->jobTitle,
                'father_monthly_income' => $faker->randomElement(["Below ₱10,000", "₱10,000 - ₱20,000", "₱20,001 - ₱30,000", "₱30,001 - ₱40,000"]),
                'father_mobile_number' => $faker->phoneNumber,
                'guardian_first_name' => $faker->firstName,
                'guardian_middle_name' => $faker->firstName,
                'guardian_last_name' => $faker->lastName,
                'guardian_religion' => $faker->randomElement(['Catholic', 'Christian', 'Muslim', 'MCGI']),
                'guardian_occupation' => $faker->jobTitle,
                'guardian_monthly_income' => $faker->randomElement(["Below ₱10,000", "₱10,000 - ₱20,000", "₱20,001 - ₱30,000", "₱30,001 - ₱40,000"]),
                'guardian_mobile_number' => $faker->phoneNumber,
                'guardian_relationship' => $faker->randomElement(['Uncle', 'Aunt', 'Grandparent', 'Sibling', 'Family Friend']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Student family information seeded successfully.');
    }
}
