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

        $formTypeIds = FormType::pluck('id');

        if ($formTypeIds->isEmpty()) {
            $this->command->warn('No Form Types found. Skipping FormFieldSeeder.');
            return;
        }

        $fieldTypes = [
            'text',
            'textarea',
            'date',
            'checkbox',
            'single_checkbox',
            'radio',
            'select',
            '2x2_image',
        ];

        $fields = [];

        foreach ($formTypeIds as $formTypeId) {
            foreach (range(1, 5) as $i) {
                $type = $faker->randomElement($fieldTypes);
                $label = match ($type) {
                    'text' => 'Full Name',
                    'textarea' => 'Additional Information',
                    'date' => 'Birthdate',
                    'checkbox' => 'Select applicable options',
                    'single_checkbox' => 'Agree to terms?',
                    'radio' => 'Choose one',
                    'select' => 'Pick an option',
                    '2x2_image' => 'Upload 2x2 ID Photo',
                };

                $fieldData = [
                    'type' => $type,
                    'name' => $label,
                    'options' => in_array($type, ['checkbox', 'radio', 'select']) ? ['Option A', 'Option B', 'Option C'] : [],
                ];

                $fields[] = [
                    'form_type_id' => $formTypeId,
                    'field_data' => json_encode($fieldData),
                    'required' => $faker->boolean(70),
                    'page' => $faker->numberBetween(1, 2),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        FormField::insert($fields);
        $this->command->info('Form fields seeded for all form types.');
    }
}
