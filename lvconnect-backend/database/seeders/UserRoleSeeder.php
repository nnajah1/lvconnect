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
                $user = User::create([
                    'name' => $faker->name,
                    'email' => $faker->unique()->safeEmail,
                    'password' => Hash::make('password123'),
                ]);

                $user->assignRole($role);
            }

            $this->command->info("5 users created and assigned role: {$roleName}");
        }
    }
}
