<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FormSubmission;
use App\Models\FormField;
use App\Models\FormSubmissionData;
use Faker\Factory as Faker;

class FormSubmissionDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $submissions = FormSubmission::all();
        $fields = FormField::all();

        foreach ($submissions as $submission) {
            $selectedFields = $fields->random(rand(2, 4));

            foreach ($selectedFields as $field) {
                FormSubmissionData::create([
                    'form_submission_id' => $submission->id,
                    'form_field_id' => $field->id,
                    'field_name' => $field->field_data['label'] ?? 'Unknown Field',
                    'answer_data' => json_encode($faker->words(rand(1, 5), true)),
                    'is_verified' => $faker->boolean(70), 
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
