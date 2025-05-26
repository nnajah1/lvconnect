<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\User;
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

        $surveyTitles = [
            'Post-Flood Emergency Response Survey',
            'Typhoon Preparedness Feedback',
            'School Fire Drill Effectiveness Survey',
            'Campus Security Incident Response Survey',
            'COVID-19 Health and Safety Measures Survey',
        ];

        $questionsPerSurvey = [
            [
                'I received timely and accurate updates about the flood situation from the school.',
                'The school had a clear and effective evacuation or safety protocol.',
                'I felt supported by school staff during and after the flood.',
                'Communication channels (e.g., SMS, email, portal) were used effectively during the incident.',
                'The school provided adequate post-flood support (e.g., counseling, academic adjustments).',
            ],
            [
                'The school provided sufficient information about typhoon preparedness.',
                'Emergency supplies and shelters were adequately available during the typhoon.',
                'The school’s communication during the typhoon was clear and timely.',
                'I felt safe and well-informed during the typhoon.',
                'Post-typhoon support was helpful and accessible.',
            ],
            [
                'The fire drill was conducted regularly and effectively.',
                'Evacuation routes were clearly marked and easy to follow.',
                'Staff provided adequate assistance during the fire drill.',
                'The fire drill helped me understand emergency procedures better.',
                'Overall, the fire drill improved campus safety awareness.',
            ],
            [
                'I am confident in the school’s response to security incidents.',
                'Security personnel acted quickly and effectively during incidents.',
                'The school communicates well about security-related concerns.',
                'I feel safe on campus due to the security measures in place.',
                'The school offers sufficient support following security incidents.',
            ],
            [
                'The health and safety protocols for COVID-19 were clear and easy to follow.',
                'The school provided adequate sanitation and hygiene facilities.',
                'Communication about COVID-19 updates was timely and accurate.',
                'I felt supported by the school regarding my health and safety concerns.',
                'The school’s COVID-19 measures helped maintain a safe learning environment.',
            ],
        ];

        foreach ($surveyTitles as $index => $title) {
            $survey = Survey::create([
                'title' => $title,
                'description' => 'This survey collects feedback related to the event or incident: ' . $title,
                'created_by' => $faker->randomElement($psasUserIds),
                'visibility_mode' => 'mandatory',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $questions = $questionsPerSurvey[$index];

            foreach ($questions as $qIndex => $questionText) {
                SurveyQuestion::create([
                    'survey_id' => $survey->id,
                    'survey_question_type' => 'likert',
                    'question' => $questionText,
                    'survey_question_data' => json_encode(['scale' => [1, 2, 3, 4, 5]]),
                    'order' => $qIndex + 1,
                    'is_required' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('5 surveys created without student responses.');
    }
}
