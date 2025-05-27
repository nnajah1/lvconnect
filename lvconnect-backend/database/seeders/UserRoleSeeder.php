<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
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

        // Seed roles except superadmin
        foreach ($roles as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'api']);

            $firstName = ucfirst($roleName);
            $lastName = 'lv';
            $email = strtolower($roleName) . '_' . $lastName . '@email.com';

            $user = User::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'password' => Hash::make('password123'),
                'avatar' => $this->faker()->imageUrl(200, 200, 'people', true, 'Avatar'),
                'must_change_password' => false,
            ]);

            $user->assignRole($role);
            $this->command->info("User created and assigned role: {$roleName}");
        }

        // Separate seeding for superadmins: Mae and Ann
        $superadminRole = Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'api']);
        $superadmins = [
            ['first_name' => 'jannah', 'last_name' => 'delarosa', 'email' => 'jannahdelarosa@student.laverdad.edu.ph'],
            ['first_name' => 'azhelle', 'last_name' => 'casimiro', 'email' => 'jannahdelarosa@student.laverdad.edu.ph'],
        ];

        foreach ($superadmins as $data) {
            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'password' => Hash::make('password123'),
                'avatar' => $this->faker()->imageUrl(200, 200, 'people', true, 'Avatar'),
                'must_change_password' => false,
            ]);

            $user->assignRole($superadminRole);
            $this->command->info("Superadmin created: {$data['first_name']} {$data['last_name']}");
        }
    }

    /**
     * Get a Faker instance.
     */
    protected function faker()
    {
        return \Faker\Factory::create();
    }
}
