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

        $formTypes = [
            [
                'title' => 'Admission Request Form (ARL)',
                'description' => 'Form for new student admissions including personal info, previous school records, and guardian details.',
                'content' => '<p>Please fill out all sections carefully to apply for admission.</p>',
                'has_pdf' => false,
                'is_visible' => true,
            ],
            [
                'title' => 'Leave of Absence Form',
                'description' => 'Request form for students to apply for temporary leave from school due to valid reasons.',
                'content' => '<p>Specify the duration and reason for your leave request.</p>',
                'has_pdf' => false,
                'is_visible' => true,
            ],
            [
                'title' => 'Course Change Request Form',
                'description' => 'Form for students requesting to change their enrolled course or program.',
                'content' => '<p>Provide justification for the course change and attach supporting documents.</p>',
                'has_pdf' => false,
                'is_visible' => true,
            ],
            [
                'title' => 'Student Clearance Form',
                'description' => 'Clearance form to be completed before graduation or transfer, confirming all obligations are settled.',
                'content' => '<p>Must be signed by all concerned offices before submission.</p>',
                'has_pdf' => false,
                'is_visible' => true,
            ],
            [
                'title' => 'Scholarship Application Form',
                'description' => 'Application form for students seeking scholarship opportunities based on academic or financial needs.',
                'content' => '<p>Complete all sections and attach necessary documents.</p>',
                'has_pdf' => false,
                'is_visible' => true,
            ],
        ];

        foreach ($formTypes as $form) {
            FormType::updateOrCreate(
                ['title' => $form['title']],
                [
                    'description' => $form['description'],
                    'pdf_path' => null,
                    'created_by' => $faker->randomElement($psasUsers),
                    'has_pdf' => $form['has_pdf'],
                    'is_visible' => $form['is_visible'],
                    'content' => $form['content'],
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info(count($formTypes) . ' form types created or updated.');
    }
}
