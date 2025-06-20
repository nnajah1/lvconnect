<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserRoleSeeder extends Seeder
{
    public function run(): void
    {
        // Handle PSAS accounts
        $psasRole = Role::firstOrCreate(['name' => 'psas', 'guard_name' => 'api']);

        $psasUsers = [
            ['first_name' => 'Alona Joy', 'last_name' => 'Pegarit', 'email' => 'alonajoypegarit@student.laverdad.edu.ph'],
        ];

        foreach ($psasUsers as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'password' => Hash::make('password123'),
                    'avatar' => 'https://loremflickr.com/200/200/animal?random=' . $this->faker()->unique()->numberBetween(1, 9999),
                    'must_change_password' => false,
                ]
            );

            if (!$user->hasRole('psas')) {
                $user->assignRole($psasRole);
            }

            $this->command->info("PSAS user created: {$data['first_name']}");
        }

        // Handle Super Admin accounts
        $superAdminRole = Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'api']);

        $superAdminUsers = [
            ['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'email' => 'juandelacruz@student.laverdad.edu.ph'],
            ['first_name' => 'Sherline', 'last_name' => 'De Guzman', 'email' => 'Sherlinedeguzman@student.laverdad.edu.ph'],
        ];

        foreach ($superAdminUsers as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'password' => Hash::make('password123'),
                    'avatar' => 'https://loremflickr.com/200/200/animal?random=' . $this->faker()->unique()->numberBetween(1, 9999),
                    'must_change_password' => false,
                ]
            );

            if (!$user->hasRole('superadmin')) {
                $user->assignRole($superAdminRole);
            }

            $this->command->info("Super Admin user created: {$data['first_name']}");
        }

        // Handle Registrar accounts
        $registrarRole = Role::firstOrCreate(['name' => 'registrar', 'guard_name' => 'api']);

        $registrarUsers = [
            ['first_name' => 'Jannah', 'last_name' => 'Dela Rosa', 'email' => 'jannahdelarosa@student.laverdad.edu.ph'],
        ];

        foreach ($registrarUsers as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'password' => Hash::make('password123'),
                    'avatar' => 'https://loremflickr.com/200/200/animal?random=' . $this->faker()->unique()->numberBetween(1, 9999),
                    'must_change_password' => false,
                ]
            );

            if (!$user->hasRole('registrar')) {
                $user->assignRole($registrarRole);
            }

            $this->command->info("Registrar user created: {$data['first_name']}");
        }

        // Handle Comms accounts
        $commsRole = Role::firstOrCreate(['name' => 'comms', 'guard_name' => 'api']);

        $commsUsers = [
            ['first_name' => 'Azhelle', 'last_name' => 'Casimiro', 'email' => 'azhellecasimiro@student.laverdad.edu.ph'],
        ];

        foreach ($commsUsers as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'password' => Hash::make('password123'),
                    'avatar' => 'https://loremflickr.com/200/200/animal?random=' . $this->faker()->unique()->numberBetween(1, 9999),
                    'must_change_password' => false,
                ]
            );

            if (!$user->hasRole('comms')) {
                $user->assignRole($commsRole);
            }

            $this->command->info("Comms user created: {$data['first_name']}");
        }

        // Handle School Admin accounts
        $scadminRole = Role::firstOrCreate(['name' => 'scadmin', 'guard_name' => 'api']);

        $scadminUsers = [
            ['first_name' => 'Kayla', 'last_name' => 'Acosta', 'email' => 'kaylaacosta@student.laverdad.edu.ph'],
        ];

        foreach ($scadminUsers as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'password' => Hash::make('password123'),
                    'avatar' => 'https://loremflickr.com/200/200/animal?random=' . $this->faker()->unique()->numberBetween(1, 9999),
                    'must_change_password' => false,
                ]
            );

            if (!$user->hasRole('scadmin')) {
                $user->assignRole($scadminRole);
            }

            $this->command->info("School Admin user created: {$data['first_name']}");
        }
    }

    protected function faker()
    {
        return \Faker\Factory::create();
    }
}
