<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use App\Models\SurveyAnswer;
use App\Models\User;
use App\Models\StudentInformation;
use Faker\Factory as Faker;

class SurveySeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Get all PSAS user IDs
        $psasUserIds = User::role('psas')->pluck('id');
        if ($psasUserIds->isEmpty()) {
            $this->command->warn('No PSAS users found. Skipping SurveySeeder.');
            return;
        }

        // Get student information IDs for responses
        $studentInfoIds = StudentInformation::pluck('id');
        if ($studentInfoIds->isEmpty()) {
            $this->command->warn('No student information records found. Skipping SurveySeeder.');
            return;
        }

        foreach (range(1, 5) as $i) {
            $survey = Survey::create([
                'title' => $faker->sentence,
                'description' => $faker->paragraph,
                'created_by' => $faker->randomElement($psasUserIds),
                'visibility_mode' => $faker->randomElement(['hidden', 'optional', 'mandatory']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add 3 questions to each survey
            for ($q = 1; $q <= 3; $q++) {
                SurveyQuestion::create([
                    'survey_id' => $survey->id,
                    'survey_question_type' => 'likert',
                    'question' => $faker->sentence,
                    'survey_question_data' => json_encode(['scale' => [1, 2, 3, 4, 5]]),
                    'order' => $q,
                    'is_required' => $faker->boolean(80),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Create a student response
            $studentId = $faker->randomElement($studentInfoIds);
            $response = SurveyResponse::create([
                'survey_id' => $survey->id,
                'student_information_id' => $studentId,
                'submitted_at' => now()->subDays(rand(0, 30)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create answers
            foreach ($survey->questions as $question) {
                SurveyAnswer::create([
                    'survey_response_id' => $response->id,
                    'survey_question_id' => $question->id,
                    'answer' => (string) $faker->numberBetween(1, 5),
                    'taken_at' => now()->subDays(rand(0, 30)),
                    'created_at' => now(),
                ]);
            }
        }
    }
}