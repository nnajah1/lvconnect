<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FormSubmission;
use App\Models\FormSubmissionData;
use Faker\Factory as Faker;

class FormSubmissionDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $submissions = FormSubmission::with('formType.formFields')->get();

        foreach ($submissions as $submission) {
            $fields = $submission->formType?->formFields ?? collect();

            foreach ($fields as $field) {
                $type = $field->field_data['type'] ?? 'text';

                $answer = match ($type) {
                    'text' => $faker->words(3, true),
                    'textarea' => $faker->paragraph(),
                    'date' => $faker->date(),
                    'radio' => $faker->randomElement($field->field_data['options'] ?? ['Yes', 'No']),
                    'file' => 'uploads/dummy.pdf',
                    'single_checkbox' => 'checked',
                    default => 'N/A',
                };

                FormSubmissionData::create([
                    'form_submission_id' => $submission->id,
                    'form_field_id' => $field->id,
                    'field_name' => $field->field_data['name'] ?? 'Unknown Field',
                    'answer_data' => is_string($answer) ? json_encode($answer) : json_encode((string) $answer),
                    'is_verified' => $faker->boolean(70),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Form submission data seeded.');
    }
}
