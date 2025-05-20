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

        $formTypeIds = FormType::pluck('id');
        $studentUserIds = User::role('student')->pluck('id');

        if ($formTypeIds->isEmpty() || $studentUserIds->isEmpty()) {
            $this->command->warn('Missing Form Types or Student Users. Skipping FormSubmissionSeeder.');
            return;
        }

        $statuses = ['draft', 'pending', 'approved', 'rejected'];
        $submissions = [];

        foreach (range(1, 5) as $i) {
            $status = $faker->randomElement($statuses);
            $rejectedAt = $status === 'rejected' ? $faker->dateTimeBetween('-2 days', 'now') : null;
            $adminRemarks = $status === 'rejected' ? $faker->sentence() : null;

            $submissions[] = [
                'form_type_id' => $faker->randomElement($formTypeIds),
                'submitted_by' => $faker->randomElement($studentUserIds),
                'status' => $status,
                'submitted_at' => $faker->dateTimeBetween('-5 days', 'now'),
                'admin_remarks' => $adminRemarks,
                'rejected_at' => $rejectedAt,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        FormSubmission::insert($submissions);
    }
}
