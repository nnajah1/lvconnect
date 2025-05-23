<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Faker\Factory as Faker;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

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

            foreach (range(1, 5) as $i) {
                $lastName = "lv";
                $firstName = ucfirst($roleName) . $i; 
                $email = strtolower($roleName) . $i . '_' . strtolower($lastName) . '@email.com';

                $user = User::create([
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $email,
                    'password' => Hash::make('password123'),
                    'avatar' => $faker->imageUrl(200, 200, 'people', true, 'Avatar'),
                    'notify_via_email' => true,
                    'must_change_password' => false,
                ]);

                $user->assignRole($role);
            }

            $this->command->info("5 users created and assigned role: {$roleName}");
        }
    }
}
