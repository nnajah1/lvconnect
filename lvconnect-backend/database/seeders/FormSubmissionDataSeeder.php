<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FormSubmission;
use App\Models\FormSubmissionData;
use App\Models\FormField;
use Faker\Factory as Faker;

class FormSubmissionDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $submissions = FormSubmission::with('formType.fields')->get();

        foreach ($submissions as $submission) {
            $fields = $submission->formType->fields;

            foreach ($fields as $field) {
                $answer = match ($field->field_data['type']) {
                    'text' => $faker->words(3, true),
                    'textarea' => $faker->paragraph(),
                    'date' => $faker->date(),
                    'radio' => $faker->randomElement($field->field_data['options'] ?? []),
                    'file' => 'uploads/dummy.pdf',
                    'single_checkbox' => 'checked',
                    default => 'N/A',
                };

                FormSubmissionData::create([
                    'form_submission_id' => $submission->id,
                    'form_field_id' => $field->id,
                    'field_name' => $field->field_data['name'] ?? 'Unknown Field',
                    'answer_data' => json_encode($answer),
                    'is_verified' => $faker->boolean(70),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Form submission data seeded.');
    }
}
