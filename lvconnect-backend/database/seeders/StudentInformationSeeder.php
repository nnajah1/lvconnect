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
                        'Rizal St.', 'Mabini St.', 'Bonifacio Ave.', 'Del Pilar St.', 'Aurora Blvd.',
                        'Magsaysay Blvd.', 'Quirino Highway', 'Katipunan Ave.', 'San Juan St.',
                        'Quezon Blvd.', 'Roxas Ave.', 'Ninoy Aquino Ave.', 'España Blvd.', 'Taft Ave.',
                        'Aguinaldo Highway', 'J.P. Rizal St.', 'Don Juico Ave.', 'MacArthur Highway',
                        'Shaw Blvd.', 'Ortigas Ave.', 'Daang Hari Road', 'V. Luna Road', 'Recto Ave.',
                        'Makati Ave.', 'Legarda St.', 'Sampaguita St.'
                    ]),

                    'barangay' => $faker->randomElement([
                        'Barangay Dolores', 'Barangay Sto. Rosario', 'Barangay Malabanias', 'Barangay San Agustin',
                        'Barangay San Jose', 'Barangay Poblacion', 'Barangay Balibago', 'Barangay Kalikid',
                        'Barangay Lourdes', 'Barangay Mabini', 'Barangay San Pablo', 'Barangay San Vicente',
                        'Barangay Kamuning', 'Barangay Commonwealth', 'Barangay Lahug', 'Barangay Talomo',
                        'Barangay Tatalon', 'Barangay Bagong Silangan', 'Barangay Calumpang', 'Barangay Sto. Niño',
                        'Barangay Addition Hills', 'Barangay Moonwalk', 'Barangay Banilad', 'Barangay Quirino 2-A',
                        'Barangay Holy Spirit', 'Barangay Tumana', 'Barangay Bagumbayan'
                    ]),

                    'city_municipality' => $faker->randomElement([
                        'San Fernando', 'Angeles City', 'Tarlac City', 'Malolos', 'Balanga',
                        'Cabanatuan', 'Olongapo', 'Quezon City', 'Manila', 'Makati City',
                        'Pasig City', 'Iloilo City', 'Zamboanga City', 'Antipolo', 'Taguig City',
                        'Parañaque City', 'San Jose del Monte', 'Cavite City', 'Mandaluyong',
                        'Marikina', 'Lipa City', 'Cebu City', 'Davao City', 'Baguio City', 'Calumpit'
                    ]),

                    'province' => $faker->randomElement([
                        'Pampanga', 'Tarlac', 'Bulacan', 'Bataan', 'Nueva Ecija', 'Zambales', 'Aurora',
                        'Metro Manila', 'Cebu', 'Davao del Sur', 'Benguet', 'Laguna', 'Batangas',
                        'Palawan', 'Misamis Oriental', 'Cavite', 'Rizal', 'Negros Occidental',
                        'South Cotabato', 'Ilocos Norte', 'Isabela', 'Sorsogon', 'Leyte',
                        'Agusan del Norte', 'Capiz'
                    ]),

                    'zip_code' => $faker->randomElement([
                        '2000', '2021', '2300', '3000', '3100', '2100', '2200', '1008', '1014', '1200',
                        '1101', '6000', '8000', '2600', '1605', '4026', '7200', '5000', '1800',
                        '1700', '4100', '4217', '4400', '9600', '6100', '3500'
                    ]),

                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info('Student information seeded successfully for all student users.');
    }
}
