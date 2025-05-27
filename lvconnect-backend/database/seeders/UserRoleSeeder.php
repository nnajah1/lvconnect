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
            'superadmin',
            'admin',
            'comms',
            'scadmin',
            'psas',
            'student',
        ];

        foreach ($roles as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'api']);

            $userCount = $roleName === 'superadmin' ? 2 : 1;

            for ($i = 1; $i <= $userCount; $i++) {
                $firstName = ucfirst($roleName) . $i;
                $lastName = 'lv';
                $email = strtolower($roleName) . $i . '_' . $lastName . '@email.com';

                $user = User::create([
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $email,
                    'password' => Hash::make('password123'),
                    'avatar' => $this->faker()->imageUrl(200, 200, 'people', true, 'Avatar'),
                    'must_change_password' => false,
                ]);

                $user->assignRole($role);
            }

            $this->command->info("{$userCount} user(s) created and assigned role: {$roleName}");
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
