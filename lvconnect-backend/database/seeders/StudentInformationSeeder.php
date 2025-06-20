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
        $studentUsers = User::role(['student', 'superadmin'])->get();

        if ($studentUsers->isEmpty()) {
            $this->command->warn('No student users found. Skipping StudentInformationSeeder.');
            return;
        }

        $addresses = [
            [
            'floor_unit_building' => 'Unit 101',
            'house_street' => '123 St.',
            'barangay' => 'Barangay Dolores',
            'city_municipality' => 'San Fernando',
            'province' => 'Pampanga',
            'zip_code' => '2000',
            ],
            [
            'floor_unit_building' => '2nd Floor',
            'house_street' => '456 St.',
            'barangay' => 'Barangay Sto. Rosario',
            'city_municipality' => 'Angeles City',
            'province' => 'Pampanga',
            'zip_code' => '2021',
            ],
            [
            'floor_unit_building' => 'Room 305',
            'house_street' => '789 St.',
            'barangay' => 'Barangay Malabanias',
            'city_municipality' => 'Tarlac City',
            'province' => 'Tarlac',
            'zip_code' => '2300',
            ],
            [
            'floor_unit_building' => 'Apt. 12B',
            'house_street' => '321 St.',
            'barangay' => 'Barangay Salapungan',
            'city_municipality' => 'Mabalacat',
            'province' => 'Pampanga',
            'zip_code' => '2010',
            ],
            [
            'floor_unit_building' => '3rd Floor',
            'house_street' => '654 St.',
            'barangay' => 'Barangay San Nicolas',
            'city_municipality' => 'Olongapo City',
            'province' => 'Zambales',
            'zip_code' => '2200',
            ],
            [
            'floor_unit_building' => 'Unit 7',
            'house_street' => '987 MacArthur Highway',
            'barangay' => 'Barangay Cutcut',
            'city_municipality' => 'Capas',
            'province' => 'Tarlac',
            'zip_code' => '2315',
            ],
            [
            'floor_unit_building' => 'Penthouse',
            'house_street' => '159 Katipunan Ave.',
            'barangay' => 'Barangay Balibago',
            'city_municipality' => 'Angeles City',
            'province' => 'Pampanga',
            'zip_code' => '2009',
            ],
            [
            'floor_unit_building' => 'Suite 204',
            'house_street' => '753 Roxas Blvd.',
            'barangay' => 'Barangay San Jose',
            'city_municipality' => 'San Fernando',
            'province' => 'Pampanga',
            'zip_code' => '2000',
            ],
            [
            'floor_unit_building' => 'Unit 3A',
            'house_street' => '111 Malolos St.',
            'barangay' => 'Barangay Tikay',
            'city_municipality' => 'Malolos',
            'province' => 'Bulacan',
            'zip_code' => '3000',
            ],
            [
            'floor_unit_building' => '2nd Floor',
            'house_street' => '222 Marcelo H. del Pilar St.',
            'barangay' => 'Barangay Sto. Niño',
            'city_municipality' => 'Meycauayan',
            'province' => 'Bulacan',
            'zip_code' => '3020',
            ],
            [
            'floor_unit_building' => 'Room 5B',
            'house_street' => '333 MacArthur Highway',
            'barangay' => 'Barangay Taal',
            'city_municipality' => 'Bocaue',
            'province' => 'Bulacan',
            'zip_code' => '3018',
            ],
            [
            'floor_unit_building' => 'Apt. 8C',
            'house_street' => '444 Poblacion Road',
            'barangay' => 'Barangay Poblacion',
            'city_municipality' => 'San Jose del Monte',
            'province' => 'Bulacan',
            'zip_code' => '3023',
            ],
            [
            'floor_unit_building' => 'Ground Floor',
            'house_street' => '555 Gov. F. Halili Ave.',
            'barangay' => 'Barangay Iba o Este',
            'city_municipality' => 'Calumpit',
            'province' => 'Bulacan',
            'zip_code' => '3023',
            ],
            [
            'floor_unit_building' => 'Unit 2F',
            'house_street' => '101 San Vicente St.',
            'barangay' => 'Barangay San Vicente',
            'city_municipality' => 'Apalit',
            'province' => 'Pampanga',
            'zip_code' => '2016',
            ],
            [
            'floor_unit_building' => 'Ground Floor',
            'house_street' => '202 Sulipan Road',
            'barangay' => 'Barangay Sulipan',
            'city_municipality' => 'Apalit',
            'province' => 'Pampanga',
            'zip_code' => '2016',
            ],
            [
            'floor_unit_building' => 'Room 8A',
            'house_street' => '303 Sampaloc St.',
            'barangay' => 'Barangay Sampaloc',
            'city_municipality' => 'Apalit',
            'province' => 'Pampanga',
            'zip_code' => '2016',
            ],
            [
            'floor_unit_building' => 'Apt. 5C',
            'house_street' => '404 San Juan St.',
            'barangay' => 'Barangay San Juan',
            'city_municipality' => 'Apalit',
            'province' => 'Pampanga',
            'zip_code' => '2016',
            ],
            [
            'floor_unit_building' => 'Suite 1B',
            'house_street' => '505 Cansinala Road',
            'barangay' => 'Barangay Cansinala',
            'city_municipality' => 'Apalit',
            'province' => 'Pampanga',
            'zip_code' => '2016',
            ],
            [
            'floor_unit_building' => 'Unit 10A',
            'house_street' => '123 Taft Ave.',
            'barangay' => 'Barangay 678',
            'city_municipality' => 'Manila',
            'province' => 'Metro Manila',
            'zip_code' => '1000',
            ],
            [
            'floor_unit_building' => '3rd Floor',
            'house_street' => '456 España Blvd.',
            'barangay' => 'Barangay 412',
            'city_municipality' => 'Sampaloc',
            'province' => 'Metro Manila',
            'zip_code' => '1008',
            ],
            [
            'floor_unit_building' => 'Room 201',
            'house_street' => '789 Katipunan Ave.',
            'barangay' => 'Loyola Heights',
            'city_municipality' => 'Quezon City',
            'province' => 'Metro Manila',
            'zip_code' => '1108',
            ],
            [
            'floor_unit_building' => 'Apt. 4B',
            'house_street' => '321 Boni Ave.',
            'barangay' => 'Plainview',
            'city_municipality' => 'Mandaluyong',
            'province' => 'Metro Manila',
            'zip_code' => '1550',
            ],
            [
            'floor_unit_building' => 'Suite 5C',
            'house_street' => '654 Shaw Blvd.',
            'barangay' => 'Wack-Wack',
            'city_municipality' => 'Mandaluyong',
            'province' => 'Metro Manila',
            'zip_code' => '1555',
            ],
            [
            'floor_unit_building' => 'Unit 8D',
            'house_street' => '987 EDSA',
            'barangay' => 'Barangay Bagong Pag-asa',
            'city_municipality' => 'Quezon City',
            'province' => 'Metro Manila',
            'zip_code' => '1105',
            ],
            [
            'floor_unit_building' => 'Penthouse',
            'house_street' => '159 Ayala Ave.',
            'barangay' => 'Bel-Air',
            'city_municipality' => 'Makati',
            'province' => 'Metro Manila',
            'zip_code' => '1227',
            ],
            [
            'floor_unit_building' => 'Room 12F',
            'house_street' => '753 Ortigas Ave.',
            'barangay' => 'Greenhills',
            'city_municipality' => 'San Juan',
            'province' => 'Metro Manila',
            'zip_code' => '1502',
            ],
            [
            'floor_unit_building' => 'Unit 2B',
            'house_street' => '111 Aurora Blvd.',
            'barangay' => 'Cubao',
            'city_municipality' => 'Quezon City',
            'province' => 'Metro Manila',
            'zip_code' => '1109',
            ],
            [
            'floor_unit_building' => '2nd Floor',
            'house_street' => '222 Gil Puyat Ave.',
            'barangay' => 'San Isidro',
            'city_municipality' => 'Pasay',
            'province' => 'Metro Manila',
            'zip_code' => '1300',
            ],
            [
            'floor_unit_building' => 'Apt. 6C',
            'house_street' => '444 JP Rizal St.',
            'barangay' => 'Poblacion',
            'city_municipality' => 'Makati',
            'province' => 'Metro Manila',
            'zip_code' => '1210',
            ],
            [
            'floor_unit_building' => 'Ground Floor',
            'house_street' => '555 Quirino Ave.',
            'barangay' => 'Barangay Baclaran',
            'city_municipality' => 'Parañaque',
            'province' => 'Metro Manila',
            'zip_code' => '1702',
            ],
        ];

        $addressCount = count($addresses);
        $i = 0;

        foreach ($studentUsers as $user) {
            $address = $addresses[$i % $addressCount];
            $i++;

            StudentInformation::updateOrCreate(
            ['user_id' => $user->id],
            [
                'user_id' => $user->id,
                'student_id_number' => $faker->unique()->numerify('SID-#####'),
                'first_name' => $user->first_name,
                'middle_name' => $faker->firstName,
                'last_name' => $user->last_name,
                'Suffix' => $faker->optional()->suffix,
                'civil_status' => $faker->randomElement(['single', 'married', 'widowed']),
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
                'floor/unit/building_no' => $address['floor_unit_building'],
                'house_no/street' => $address['house_street'],
                'barangay' => $address['barangay'],
                'city_municipality' => $address['city_municipality'],
                'province' => $address['province'],
                'zip_code' => $address['zip_code'],
                'created_at' => now(),
                'updated_at' => now(),
            ]
            );
        }

        $this->command->info('Student information seeded successfully for all student users.');
    }
}
