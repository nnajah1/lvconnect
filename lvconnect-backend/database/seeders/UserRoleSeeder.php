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
        $roles = [
            'registrar',
            'admin',
            'comms',
            'scadmin',
            'psas',
            'student',
        ];

        // Seed non-superadmin roles
        foreach ($roles as $roleName) {
            $role = Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'api',
            ]);

            $firstName = ucfirst($roleName);
            $lastName = 'lv';
            $email = strtolower($roleName) . '_' . $lastName . '@email.com';

            $user = User::updateOrCreate(
                ['email' => $email],
                [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
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

        // Superadmins
        $superadminRole = Role::firstOrCreate([
            'name' => 'superadmin',
            'guard_name' => 'api',
        ]);

        $superadmins = [
            ['first_name' => 'Azhelle', 'last_name' => 'Casimiro', 'email' => 'azhellecasimiro@student.laverdad.edu.ph'],
            ['first_name' => 'Jannah', 'last_name' => 'Dela Rosa', 'email' => 'jannahdelarosa@student.laverdad.edu.ph'],
        ];

        foreach ($superadmins as $data) {
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

            if (!$user->hasRole('superadmin')) {
                $user->assignRole($superadminRole);
            }

            $this->command->info("Superadmin created: {$data['first_name']} {$data['last_name']}");
        }
    }

    protected function faker()
    {
        return \Faker\Factory::create();
    }
}
