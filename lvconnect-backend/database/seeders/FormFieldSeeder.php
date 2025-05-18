<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FormField;
use App\Models\FormType;
use Faker\Factory as Faker;

class FormFieldSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Get all form type IDs
        $formTypeIds = FormType::pluck('id');

        if ($formTypeIds->isEmpty()) {
            $this->command->warn('No Form Types found. Skipping FormFieldSeeder.');
            return;
        }

        $fields = [];

        foreach (range(1, 5) as $i) {
            $fields[] = [
                'form_type_id' => $faker->randomElement($formTypeIds),
                'field_data' => json_encode([
                    'label' => $faker->words(2, true),
                    'type' => $faker->randomElement(['text', 'number', 'email', 'date', 'textarea']),
                ]),
                'required' => $faker->boolean(70), // 70% chance required
                'page' => $faker->numberBetween(1, 2),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        FormField::insert($fields);
    }
}
