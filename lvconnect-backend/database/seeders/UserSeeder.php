<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {

        // Ensure the 'student' role exists
        $studentRole = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'api']);

        // student accounts
        $students = [
            ['first_name' => 'Daniel',    'last_name' => 'Casimiro',    'email' => 'daniel.casimiro@student.laverdad.edu.ph'],
        ];

        foreach ($students as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'password' => Hash::make('password'),
                    'avatar' => 'https://loremflickr.com/200/200/animal?random=' . $this->faker()->unique()->numberBetween(1, 9999),
                    'must_change_password' => false,
                ]
            );

            $user->assignRole($studentRole);
        }

        $this->command->info('50 student users seeded with "student" role and avatars.');
    }

    protected function faker()
    {
        return \Faker\Factory::create();
    }
}
