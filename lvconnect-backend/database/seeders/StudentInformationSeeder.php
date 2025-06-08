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

        // Get all users with the 'student' role 
        $studentUsers = User::role('student')->get();

        if ($studentUsers->isEmpty()) {
            $this->command->warn('No student users found. Skipping StudentInformationSeeder.');
            return;
        }

        foreach ($studentUsers as $user) {
            StudentInformation::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'user_id' => $user->id,
                    'student_id_number' => $faker->unique()->numerify('SID-#####'),
                    'first_name' => $user->first_name,
                    'middle_name' => $faker->firstName,
                    'last_name' => $user->last_name,
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
                    'floor/unit/building_no' => $faker->randomElement([
                        'Unit 101', '2nd Floor', 'Room 305', 'Bldg. A', 'Penthouse',
                        'Ground Floor', 'Unit 5B', 'Suite 202', '3rd Floor', 'Unit 12-C'
                    ]),

                    'house_no/street' => $faker->buildingNumber . ' ' . $faker->randomElement([
                        'Rizal St.', 'Bonifacio Ave.', 'Quezon Blvd.', 'Mabini St.',
                        'Roxas Ave.', 'Del Pilar St.', 'Aurora Blvd.', 'Katipunan Ave.',
                        'Magsaysay Blvd.', 'San Juan St.', 'Ninoy Aquino Ave.'
                    ]),

                    'barangay' => $faker->randomElement([
                        'Barangay Dolores', 'Barangay Sto. Rosario', 'Barangay San Agustin', 'Barangay San Pablo',
                        'Barangay San Jose', 'Barangay Lourdes', 'Barangay San Vicente',
                        'Barangay Kamuning', 'Barangay Commonwealth', 'Barangay Poblacion',
                        'Barangay Malanday', 'Barangay Balibago', 'Barangay Lahug', 'Barangay Talomo'
                    ]),

                    'city_municipality' => $faker->randomElement([
                        'San Fernando', 'Angeles City', 'Tarlac City', 'Malolos', 'Balanga', 'Cabanatuan', 'Olongapo',
                        'Quezon City', 'Manila', 'Cebu City', 'Davao City', 'Baguio City', 'Calumpit',
                        'Makati City', 'Pasig City', 'Iloilo City', 'Zamboanga City', 'Antipolo'
                    ]),

                    'province' => $faker->randomElement([
                        'Pampanga', 'Tarlac', 'Bulacan', 'Bataan', 'Nueva Ecija', 'Zambales', 'Aurora',
                        'Metro Manila', 'Cebu', 'Davao del Sur', 'Benguet', 'Laguna',
                        'Batangas', 'Palawan', 'Misamis Oriental', 'Cavite'
                    ]),

                    'zip_code' => $faker->randomElement([
                        '2000', '2300', '3000', '3100', '2400', '2200', '3003',
                        '2100', '1000', '1101', '6000', '8000', '2600', '1605', '4026', '7200', '5000'
                    ]),

                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info('Student information seeded successfully for all student users.');
    }
}
