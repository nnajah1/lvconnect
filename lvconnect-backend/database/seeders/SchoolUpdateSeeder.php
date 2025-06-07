<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SchoolUpdate;
use App\Models\User;
use Faker\Factory as Faker;

class SchoolUpdateSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $commsUsers = User::role('comms')->get();
        $scAdminUsers = User::role('scadmin')->get();

        if ($commsUsers->isEmpty()) {
            $this->command->warn('No users with comms role found. Skipping SchoolUpdateSeeder.');
            return;
        }

        $updates = [
            [
                'type' => 'event',
                'title' => 'Intramurals 2025',
                'content' => 'Join us for the week-long Intramurals event! There will be sports, contests, and performances from all departments.',
                'is_urgent' => false,
            ],
            [
                'type' => 'announcement',
                'title' => 'Cancelled Classes due to Typhoon Alert',
                'content' => 'All classes are cancelled from May 27–29 due to the typhoon warning. Stay safe and follow advisories.',
                'is_urgent' => true,
            ],
            [
                'type' => 'event',
                'title' => 'Teachers’ Day Program',
                'content' => 'We invite all students to join the celebration of Teachers’ Day this Friday at the Auditorium. Bring your messages and tokens of appreciation!',
                'is_urgent' => false,
            ],
            [
                'type' => 'announcement',
                'title' => 'General Assembly for All Students',
                'content' => 'A mandatory general assembly will be held on June 3. Topics include updates on the academic calendar and student policies.',
                'is_urgent' => true,
            ],
            [
                'type' => 'announcement',
                'title' => 'Final Exams Schedule Released',
                'content' => 'Check the student portal now for your final exam schedules. Review guidelines and room assignments carefully.',
                'is_urgent' => false,
            ],
        ];

        foreach ($updates as $data) {
            $createdBy = $faker->randomElement($commsUsers);
            $approvedBy = $scAdminUsers->isNotEmpty() ? $faker->optional(0.7)->randomElement($scAdminUsers) : null;

            SchoolUpdate::create([
                'created_by' => $createdBy->id,
                'approved_by' => $approvedBy?->id,
                'type' => $data['type'],
                'title' => $data['title'],
                'content' => $data['content'],
                'image_url' => [$faker->randomElement(['demo1.jpg', 'demo2.jpg', 'demo3.jpg'])],
                'status' => $faker->randomElement(['approved', 'published', 'draft', 'rejected']),
                'is_notified' => $faker->boolean(30),
                'is_urgent' => $data['is_urgent'],
                'revision_fields' => null,
                'revision_remarks' => null,
                'facebook_post_id' => null,
                'rejected_at' => null,
                'synced_at' => null,
                'restored_at' => null,
                'published_at' => $faker->optional()->dateTimeThisYear(),
                'archived_at' => $faker->optional()->dateTimeThisYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('5 Real-life school updates seeded successfully.');
    }
}
