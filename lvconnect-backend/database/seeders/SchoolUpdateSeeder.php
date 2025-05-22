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

        foreach (range(1, 10) as $i) {
            $createdBy = $faker->randomElement($commsUsers);
            $approvedBy = $scAdminUsers->isNotEmpty() ? $faker->optional(0.7)->randomElement($scAdminUsers) : null;

            SchoolUpdate::create([
                'created_by' => $createdBy->id,
                'approved_by' => $approvedBy?->id,
                'type' => $faker->randomElement(['announcement', 'event']),
                'title' => $faker->sentence(6, true),
                'content' => $faker->paragraphs(3, true),
                'image_url' => $faker->optional()->imageUrl(),
                'status' => $faker->randomElement(['draft', 'pending', 'approved', 'rejected', 'for_revision', 'published']),
                'is_notified' => $faker->boolean(30),
                'is_urgent' => $faker->boolean(20),
                'revision_fields' => $faker->optional()->randomElement([json_encode(['title', 'content']), null]),
                'revision_remarks' => $faker->optional()->sentence(),
                'post_to_facebook' => $faker->boolean(20),
                'facebook_post_id' => $faker->optional()->uuid(),
                'rejected_at' => $faker->optional()->dateTimeThisYear(),
                'published_at' => $faker->optional()->dateTimeThisYear(),
                'archived_at' => $faker->optional()->dateTimeThisYear(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('School updates seeded successfully.');
    }
}
