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
        $namedRoles = [
            'registrar' => ['first_name' => 'Alona Joy', 'last_name' => 'Pegarit', 'email' => 'alonajoypegarit@student.laverdad.edu.ph'],
            'scadmin' => ['first_name' => 'Scadmin', 'last_name' => 'User', 'email' => 'scadmin@email.com'],
            'comms' => ['first_name' => 'Sherline', 'last_name' => 'De Guzman', 'email' => 'Sherlinedeguzman@student.laverdad.edu.ph'],
            'admin' => ['first_name' => 'Admin', 'last_name' => 'User', 'email' => 'admin@email.com'],
        ];

        foreach ($namedRoles as $roleName => $data) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'api']);

            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'password' => Hash::make('password123'),
                    'avatar' => $this->faker()->imageUrl(200, 200, 'people', true, 'Avatar'),
                    'must_change_password' => false,
                ]
            );

            if (!$user->hasRole($roleName)) {
                $user->assignRole($role);
            }

            $this->command->info("User created and assigned role: {$roleName}");
        }

        //IT Expert users 
        $itExpertRoles = ['superadmin', 'scadmin', 'registrar', 'student', 'psas', 'comms'];

        $itExperts = [
            ['first_name' => 'Azhelle', 'last_name' => 'Casimiro', 'email' => 'azhellecasimiro@student.laverdad.edu.ph'],
            ['first_name' => 'Jannah', 'last_name' => 'Dela Rosa', 'email' => 'jannahdelarosa@student.laverdad.edu.ph'],
            ['first_name' => 'Kayla', 'last_name' => 'Acosta', 'email' => 'kaylaacosta@student.laverdad.edu.ph'],
            
            ['first_name' => 'Jerreck', 'last_name' => 'Navalta', 'email' => 'jerreckreynaldnavalta@laverdad.edu.ph'],
            ['first_name' => 'Carlo', 'last_name' => 'Soleta', 'email' => 'carlosoleta@laverdad.edu.ph'],
            ['first_name' => 'Jehu', 'last_name' => 'Casimiro', 'email' => 'jehucasimiro@laverdad.edu.ph'],
            ['first_name' => 'Daniel John', 'last_name' => 'Saballa', 'email' => 'danieljohn.saballa@laverdad.edu.ph'],
        ];

        foreach ($itExperts as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'first_name' => $data['first_name'],
                    'last_name'  => $data['last_name'],
                    'password'   => Hash::make('password123'),
                    'avatar'     => $this->faker()->imageUrl(200, 200, 'people', true, 'Avatar'),
                    'must_change_password' => false,
                ]
            );

            foreach ($itExpertRoles as $roleName) {
                $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'api']);
                if (!$user->hasRole($roleName)) {
                    $user->assignRole($role);
                }
            }

            $this->command->info("IT Expert user created and assigned all roles: {$data['email']}");
        }

        // Handle PSAS accounts
        $psasRole = Role::firstOrCreate(['name' => 'psas', 'guard_name' => 'api']);

        $psasUsers = [
            ['first_name' => 'Luckie', 'last_name' => 'Villanueva', 'email' => 'luckievillanueva@laverdad.edu.ph'],
            ['first_name' => 'Willen Anne', 'last_name' => 'Alba', 'email' => 'willenannealba@laverdad.edu.ph'],
        ];

        foreach ($psasUsers as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'password' => Hash::make('password123'),
                    'avatar' => $this->faker()->imageUrl(200, 200, 'people', true, 'Avatar'),
                    'must_change_password' => false,
                ]
            );

            if (!$user->hasRole('psas')) {
                $user->assignRole($psasRole);
            }

            $this->command->info("PSAS user created: {$data['first_name']}");
        }
    }

    protected function faker()
    {
        return \Faker\Factory::create();
    }
}
