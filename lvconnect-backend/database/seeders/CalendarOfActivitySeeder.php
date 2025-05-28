<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CalendarOfActivity;
use App\Models\User;
use Faker\Factory as Faker;

class CalendarOfActivitySeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Get all comms user IDs
        $commsUserIds = User::role('comms')->pluck('id');

        if ($commsUserIds->isEmpty()) {
            $this->command->warn('No comms users found. Skipping CalendarOfActivitySeeder.');
            return;
        }

        $events = [
            [
                'event_title' => 'Orientation Week',
                'start_date' => '2025-06-01',
                'end_date' => '2025-06-07',
            ],
            [
                'event_title' => 'Midterm Exams',
                'start_date' => '2025-08-10',
                'end_date' => '2025-08-15',
            ],
            [
                'event_title' => 'Cultural Festival',
                'start_date' => '2025-09-20',
                'end_date' => '2025-09-22',
            ],
            [
                'event_title' => 'Graduation Ceremony',
                'start_date' => '2025-11-15',
                'end_date' => '2025-11-15',
            ],
            [
                'event_title' => 'Holiday Break',
                'start_date' => '2025-12-20',
                'end_date' => '2026-01-05',
            ],
            [
                'event_title' => 'Sports Day',
                'start_date' => '2025-07-12',
                'end_date' => '2025-07-12',
            ],
            [
                'event_title' => 'Science Fair',
                'start_date' => '2025-10-05',
                'end_date' => '2025-10-07',
            ],
            [
                'event_title' => 'Teacher’s Day Celebration',
                'start_date' => '2025-10-15',
                'end_date' => '2025-10-15',
            ],
            [
                'event_title' => 'Community Service Week',
                'start_date' => '2025-11-01',
                'end_date' => '2025-11-07',
            ],
            [
                'event_title' => 'Book Fair',
                'start_date' => '2025-09-01',
                'end_date' => '2025-09-03',
            ],
        ];

        foreach ($events as $event) {
            CalendarOfActivity::create([
                'created_by' => $commsUserIds->random(),
                'event_title' => $event['event_title'],
                'start_date' => $event['start_date'],
                'end_date' => $event['end_date'],
            ]);
        }

        $this->command->info('Calendar of activities seeded successfully.');
    }
}
