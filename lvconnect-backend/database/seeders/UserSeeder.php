<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Ensure the 'student' role exists
        $studentRole = Role::firstOrCreate(['name' => 'student']);

        $users = [];

        foreach (range(1, 10) as $i) {
            $firstName = $faker->firstName;
            $lastName = $faker->lastName;
            $email = strtolower($firstName . '.' . $lastName . $i . '@example.com');

            $users[] = [
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'password' => Hash::make('password'), // Default password
                'avatar' => $faker->imageUrl(200, 200, 'people', true, 'Avatar'), // avatar URL
                'notify_via_email' => true,
                'must_change_password' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Bulk insert
        User::insert($users);

        // Attach roles individually (must be done after insert so we can fetch User models)
        $createdUsers = User::latest()->take(10)->get();
        foreach ($createdUsers as $user) {
            $user->assignRole($studentRole);
        }

        $this->command->info('10 student users seeded with "student" role and avatars.');
    }
}
