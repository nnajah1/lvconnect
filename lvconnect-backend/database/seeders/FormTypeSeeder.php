<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FormType;
use App\Models\User;
use Faker\Factory as Faker;

class FormTypeSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $psasUsers = User::role('psas')->pluck('id');

        if ($psasUsers->isEmpty()) {
            $this->command->warn('No PSAS users found. Skipping FormTypeSeeder.');
            return;
        }

        foreach (range(1, 5) as $i) {
            FormType::create([
                'title' => $faker->sentence(3),
                'description' => $faker->sentence(),
                'pdf_path' => null,
                'created_by' => $faker->randomElement($psasUsers),
                'has_pdf' => $faker->boolean(),
                'is_visible' => $faker->boolean(),
                'content' => '<p>' . $faker->paragraph() . '</p>',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
