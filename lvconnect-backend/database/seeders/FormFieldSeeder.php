<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FormField;
use App\Models\FormType;

class FormFieldSeeder extends Seeder
{
    public function run(): void
    {
        $addFields = function ($formType, $fields) {
            foreach ($fields as $field) {
                FormField::create([
                    'form_type_id' => $formType->id,
                    'field_data' => [ 
                        'type' => $field['type'],
                        'name' => $field['name'],
                        'options' => $field['options'] ?? [],
                    ],
                    'required' => $field['required'] ?? false,
                    'page' => $field['page'] ?? 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        };

        // Fetch each form type by title and add fields accordingly

        $admissionForm = FormType::where('title', 'Admission Request Form (ARL)')->first();
        if ($admissionForm) {
            $fields = [
                ['type' => 'text', 'name' => 'Full Name', 'required' => true, 'page' => 1],
                ['type' => 'date', 'name' => 'Date of Birth', 'required' => true, 'page' => 1],
                ['type' => 'text', 'name' => 'Previous School Attended', 'required' => false, 'page' => 2],
                ['type' => 'radio', 'name' => 'Gender', 'options' => ['Male', 'Female', 'Other'], 'required' => true, 'page' => 1],
                ['type' => 'text', 'name' => 'Guardian Details', 'required' => true, 'page' => 2],
            ];
            $addFields($admissionForm, $fields);
        }

        $leaveForm = FormType::where('title', 'Leave of Absence Form')->first();
        if ($leaveForm) {
            $fields = [
                ['type' => 'date', 'name' => 'Leave Start Date', 'required' => true, 'page' => 1],
                ['type' => 'date', 'name' => 'Leave End Date', 'required' => true, 'page' => 1],
                ['type' => 'textarea', 'name' => 'Reason for Leave', 'required' => true, 'page' => 1],
                ['type' => 'single_checkbox', 'name' => 'I agree to the terms and conditions', 'required' => true, 'page' => 1],
            ];
            $addFields($leaveForm, $fields);
        }

        $courseChangeForm = FormType::where('title', 'Course Change Request Form')->first();
        if ($courseChangeForm) {
            $fields = [
                ['type' => 'text', 'name' => 'Current Course/Program', 'required' => true, 'page' => 1],
                ['type' => 'text', 'name' => 'Desired Course/Program', 'required' => true, 'page' => 1],
                ['type' => 'textarea', 'name' => 'Reason for Change', 'required' => true, 'page' => 1],
                ['type' => 'file', 'name' => 'Supporting Documents', 'required' => false, 'page' => 2],
            ];
            $addFields($courseChangeForm, $fields);
        }

        $clearanceForm = FormType::where('title', 'Student Clearance Form')->first();
        if ($clearanceForm) {
            $fields = [
                ['type' => 'textarea', 'name' => 'List of obligations settled', 'required' => true, 'page' => 1],
                ['type' => 'text', 'name' => 'Clearance Officer Name', 'required' => true, 'page' => 1],
                ['type' => 'date', 'name' => 'Clearance Date', 'required' => true, 'page' => 1],
                ['type' => 'single_checkbox', 'name' => 'I certify that all obligations are settled', 'required' => true, 'page' => 1],
            ];
            $addFields($clearanceForm, $fields);
        }

        $scholarshipForm = FormType::where('title', 'Scholarship Application Form')->first();
        if ($scholarshipForm) {
            $fields = [
                ['type' => 'text', 'name' => 'Full Name', 'required' => true, 'page' => 1],
                ['type' => 'textarea', 'name' => 'Academic Achievements', 'required' => false, 'page' => 1],
                ['type' => 'textarea', 'name' => 'Financial Need Explanation', 'required' => true, 'page' => 2],
                ['type' => 'file', 'name' => 'Supporting Documents', 'required' => false, 'page' => 2],
            ];
            $addFields($scholarshipForm, $fields);
        }

        $this->command->info('Form fields seeded for all form types.');
    }
}
