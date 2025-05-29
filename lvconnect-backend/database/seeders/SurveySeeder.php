<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\User;
use Illuminate\Support\Arr;
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
                'How did the flood impact your ability to attend classes?',
                'What source did you use most to get updates?',
                'What kind of support would you want after such events?',
                'Rate the school’s SMS updates effectiveness.',
                'Briefly describe how you felt during the flood.',
            ],
            [
                'What preparations did you make before the typhoon?',
                'Select all support services you used.',
                'How would you improve communication before storms?',
                'Choose the most helpful school response:',
                'Share a personal tip for typhoon preparedness.',
            ],
            [
                'Describe your experience during the last fire drill.',
                'Pick the most useful fire drill instruction.',
                'What did you find unclear during the drill?',
                'Which areas need more fire safety tools?',
                'What would make fire drills more effective?',
            ],
            [
                'Have you ever reported a security concern?',
                'Which communication method do you prefer?',
                'What safety measure would you add?',
                'Pick all security improvements you’ve noticed.',
                'Describe a situation where you felt unsafe on campus.',
            ],
            [
                'How well did you follow COVID-19 protocols?',
                'Which safety feature helped you most?',
                'What would you change about campus guidelines?',
                'Select all hygiene practices you followed.',
                'What was your biggest challenge during the pandemic?',
            ],
        ];

        $questionTypes = [
            'Short answer',
            'Multiple choice',
            'Checkboxes',
            'Dropdown',
        ];

        foreach ($surveyTitles as $index => $title) {
            $survey = Survey::create([
                'title' => $title,
                'description' => 'This survey collects feedback related to the event or incident: ' . $title,
                'created_by' => $faker->randomElement($psasUserIds),
                'visibility_mode' => $faker->boolean(20) ? 'mandatory' : 'optional',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $questions = $questionsPerSurvey[$index];

            foreach ($questions as $qIndex => $questionText) {
                $type = $qIndex === count($questions) - 1
                    ? 'Short answer'
                    : Arr::random($questionTypes);

                $choices = in_array($type, ['Multiple choice', 'Checkboxes', 'Dropdown'])
                    ? $faker->randomElements(['Yes', 'No', 'Maybe', 'Not Sure', 'Prefer not to say'], rand(3, 5))
                    : [];

                $data = ['choices' => $choices];

                SurveyQuestion::create([
                    'survey_id' => $survey->id,
                    'survey_question_type' => $type,
                    'question' => $questionText,
                    'survey_question_data' => $data, // native JSON here
                    'order' => $qIndex + 1,
                    'is_required' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('5 surveys seeded with JSON-formatted question data.');
    }
}
