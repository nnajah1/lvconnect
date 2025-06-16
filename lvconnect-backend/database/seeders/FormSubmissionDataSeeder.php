<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FormSubmission;
use App\Models\FormSubmissionData;
use App\Models\User;

class FormSubmissionDataSeeder extends Seeder
{
    public function run(): void
    {
        $answers = [
            // Admission Request Form (ARL)
            'Full Name' => optional(User::role('student')->inRandomOrder()->first(), function ($user) {
                return $user->first_name . ' ' . $user->last_name;
            }),
            'Date of Birth' => '2005-08-15',
            'Previous School Attended' => 'Springfield High School',
            'Gender' => 'Male',
            'Guardian Details' => 'Jane Doe, 09171234567',

            // Leave of Absence Form
            'Leave Start Date' => '2024-07-01',
            'Leave End Date' => '2024-07-10',
            'Reason for Leave' => 'Medical reasons. Doctor advised rest.',
            'I agree to the terms and conditions' => 'checked',

            // Course Change Request Form
            'Current Course/Program' => 'BS Computer Science',
            'Desired Course/Program' => 'BS Information Technology',
            'Reason for Change' => 'Interested in more practical IT applications.',
            'Date Today' => date('Y-m-d'),

            // Student Clearance Form
            'List of obligations settled' => 'Library fines, Tuition fees, Laboratory equipment returned.',
            'Clearance Officer Name' => 'Mr. Smith',
            'Clearance Date' => date('Y-m-d'),
            'I certify that all obligations are settled' => 'checked',

            // Scholarship Application Form
            'Academic Achievements' => 'Dean\'s Lister, Math Olympiad Winner',
            'Financial Need Explanation' => 'Family income below minimum wage, single parent.',
            'Date today' => date('Y-m-d'),
        ];

        $submissions = FormSubmission::with('formType.formFields')->get();

        foreach ($submissions as $submission) {
            $fields = $submission->formType?->formFields ?? collect();

            foreach ($fields as $field) {
                $type = $field->field_data['type'] ?? 'text';
                $name = $field->field_data['name'] ?? 'Unknown Field';

                $answer = $answers[$name] ?? match ($type) {
                    'text' => 'Sample Text',
                    'textarea' => 'Sample paragraph for this field.',
                    'date' => date('Y-m-d'),
                    'radio' => $field->field_data['options'][0] ?? 'Yes',
                    'file' => 'uploads/dummy.pdf',
                    'single_checkbox' => 'checked',
                    default => 'N/A',
                };

                FormSubmissionData::create([
                    'form_submission_id' => $submission->id,
                    'form_field_id' => $field->id,
                    'field_name' => $name,
                    'answer_data' => (string) $answer,
                    'is_verified' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Form submission data seeded.');
    }
}
