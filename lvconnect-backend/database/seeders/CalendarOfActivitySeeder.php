<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CalendarOfActivity;
use App\Models\User;

class CalendarOfActivitySeeder extends Seeder
{
    public function run(): void
    {
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
                'description' => 'A full week of welcoming new students with campus tours, information sessions, and activities.',
                'color' => '#FFC0CB',
            ],
            [
                'event_title' => 'Midterm Exams',
                'start_date' => '2025-08-10',
                'end_date' => '2025-08-15',
                'description' => 'Students will take their midterm examinations across all subjects during this period.',
                'color' => '#bf3eff',
            ],
            [
                'event_title' => 'Cultural Festival',
                'start_date' => '2025-09-20',
                'end_date' => '2025-09-22',
                'description' => 'Celebrate diversity with cultural performances, food fairs, and art exhibits.',
                'color' => '#ffefdb',
            ],
            [
                'event_title' => 'Graduation Ceremony',
                'start_date' => '2025-11-15',
                'end_date' => '2025-11-15',
                'description' => 'A special ceremony to honor our graduating students and their academic journey.',
                'color' => '#c1ffc1',
            ],
            [
                'event_title' => 'Holiday Break',
                'start_date' => '2025-12-20',
                'end_date' => '2026-01-05',
                'description' => 'School will be closed for the holidays. Enjoy time with family and friends!',
                'color' => '#c1ffc1',
            ],
            [
                'event_title' => 'Sports Day',
                'start_date' => '2025-07-12',
                'end_date' => '2025-07-12',
                'description' => 'A day full of fun and competition through various sports and games.',
                'color' => '#CCCCFF',
            ],
            [
                'event_title' => 'Science Fair',
                'start_date' => '2025-10-05',
                'end_date' => '2025-10-07',
                'description' => 'Students showcase innovative science projects and experiments.',
                'color' => '#f1c40f',
            ],
            [
                'event_title' => 'Teacher’s Day Celebration',
                'start_date' => '2025-10-15',
                'end_date' => '2025-10-15',
                'description' => 'A celebration to recognize the dedication and hard work of our educators.',
                'color' => '#3490dc',
            ],
            [
                'event_title' => 'Community Service Week',
                'start_date' => '2025-11-01',
                'end_date' => '2025-11-07',
                'description' => 'Students and staff engage in service projects to give back to the community.',
                'color' => '#28a745',
            ],
            [
                'event_title' => 'Book Fair',
                'start_date' => '2025-09-01',
                'end_date' => '2025-09-03',
                'description' => 'An opportunity for students to explore and purchase a wide range of books.',
                'color' => '#ff5733',
            ],
        ];

        foreach ($events as $event) {
            CalendarOfActivity::create([
                'created_by' => $commsUserIds->random(),
                'event_title' => $event['event_title'],
                'description' => $event['description'],
                'start_date' => $event['start_date'],
                'end_date' => $event['end_date'],
                'color' => $event['color'],
            ]);
        }

        $this->command->info('Calendar of activities seeded successfully.');
    }
}
