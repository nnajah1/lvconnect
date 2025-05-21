<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StudentInformation;
use App\Models\User;
use Faker\Factory as Faker;

class StudentInformationSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Get users with the student role
        $studentUsers = User::role('student')->get();

        if ($studentUsers->isEmpty()) {
            $this->command->warn('No student users found. Skipping StudentInformationSeeder.');
            return;
        }

        foreach ($studentUsers as $user) {
            StudentInformation::create([
                'user_id' => $user->id,
                'student_id_number' => $faker->unique()->numerify('SID-#####'),
                'first_name' => $faker->firstName,
                'middle_name' => $faker->firstName,
                'last_name' => $faker->lastName,
                'Suffix' => $faker->optional()->suffix,
                'civil_status' => $faker->randomElement(['single', 'married', 'divorced', 'widowed']),
                'gender' => $faker->randomElement(['male', 'female']),
                'birth_date' => $faker->date(),
                'birth_place' => $faker->city,
                'mobile_number' => $faker->phoneNumber,
                'religion' => $faker->randomElement(['Catholic', 'Christian', 'Muslim', 'Others']),
                'lrn' => $faker->numerify('###########'),
                'fb_link' => 'https://facebook.com/' . $faker->userName,
                'student_type' => $faker->randomElement(['regular', 'irregular']),
                'government_subsidy' => $faker->randomElement(['TES', 'TDP', 'None']),
                'scholarship_status' => $faker->randomElement(['Full', 'Partial', 'None']),
                'last_school_attended' => $faker->company . ' High School',
                'previous_school_address' => $faker->address,
                'school_type' => $faker->randomElement(['Public', 'Private']),
                'academic_awards' => $faker->randomElement(['With Honors', 'With High Honors', 'None']),
                'floor/unit/building_no' => $faker->buildingNumber,
                'house_no/street' => $faker->streetAddress,
                'barangay' => $faker->streetName,
                'city_municipality' => $faker->city,
                'province' => $faker->state,
                'zip_code' => $faker->postcode,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Student information seeded successfully.');
    }
}
