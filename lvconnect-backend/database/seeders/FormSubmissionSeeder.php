<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FormSubmission;
use App\Models\FormType;
use App\Models\User;
use Faker\Factory as Faker;

class FormSubmissionSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $formTypes = FormType::all();
        $studentUserIds = User::role('student')->pluck('id');

        if ($formTypes->isEmpty() || $studentUserIds->isEmpty()) {
            $this->command->warn('Missing Form Types or Student Users. Skipping FormSubmissionSeeder.');
            return;
        }

        $statuses = ['draft', 'pending', 'approved', 'rejected'];

        foreach ($formTypes as $formType) {
            for ($i = 0; $i < 5; $i++) {
                $status = $faker->randomElement($statuses);
                $rejectedAt = $status === 'rejected' ? $faker->dateTimeBetween('-2 days', 'now') : null;
                $adminRemarks = $status === 'rejected' ? $faker->sentence() : null;

                FormSubmission::create([
                    'form_type_id' => $formType->id,
                    'submitted_by' => $faker->randomElement($studentUserIds),
                    'status' => $status,
                    'submitted_at' => $faker->dateTimeBetween('-5 days', 'now'),
                    'admin_remarks' => $adminRemarks,
                    'rejected_at' => $rejectedAt,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Form submissions seeded for each form type.');
    }
}
