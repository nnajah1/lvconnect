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

        // Seeder content
        $formTypes = [
            [
                'title' => 'Admission Request Form (ARL)',
                'description' => 'Form for new student admissions including personal info, previous school records, and guardian details.',
                'content' => '<p>Please fill out all sections carefully to apply for admission.</p>
                                <p>Name: {{Full Name}}
                                Birthday: {{Date of Birth}}
                                Gender: {{Gender}}
                                Previous School: {{Previous School Attended}}
                                Guardian: {{Guardian Details}}</p>',
                'has_pdf' => false,
                'is_visible' => true,
            ],
            [
                'title' => 'Leave of Absence Form',
                'description' => 'Request form for students to apply for temporary leave from school due to valid reasons.',
                'content' => '<p>Specify the duration and reason for your leave request.</p>
                                <p>Start: {{Leave Start Date}}
                                End: {{Leave End Date}}
                                Reason: {{Reason for Leave}}
                                Agreement: {{I agree to the terms and conditions}}</p>',
                'has_pdf' => false,
                'is_visible' => true,
            ],
            [
                'title' => 'Course Change Request Form',
                'description' => 'Form for students requesting to change their enrolled course or program.',
                'content' => '<p>Provide justification for the course change and attach supporting documents.</p>
                                <p>Current Program: {{Current Course/Program}}
                                Desired Program: {{Desired Course/Program}}
                                Reason: {{Reason for Change}}
                                Documents: {{Supporting Documents}}</p>',
                'has_pdf' => false,
                'is_visible' => true,
            ],
            [
                'title' => 'Student Clearance Form',
                'description' => 'Clearance form to be completed before graduation or transfer, confirming all obligations are settled.',
                'content' => '<p>Must be signed by all concerned offices before submission.</p>
                                <p>Obligations: {{List of obligations settled}}
                                Officer: {{Clearance Officer Name}}
                                Date: {{Clearance Date}}
                                Certification: {{I certify that all obligations are settled}}</p>',
                'has_pdf' => false,
                'is_visible' => true,
            ],
            [
                'title' => 'Scholarship Application Form',
                'description' => 'Application form for students seeking scholarship opportunities based on academic or financial needs.',
                'content' => '<p>Complete all sections and attach necessary documents.</p>
                                <p>Name: {{Full Name}}
                                Achievements: {{Academic Achievements}}
                                Financial Need: {{Financial Need Explanation}}
                                Documents: {{Supporting Documents}}</p>',
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
