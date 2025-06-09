<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\NotificationPreference;

class NotificationPreferenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch all student users
        $students = User::role('student')->get();

        foreach ($students as $student) {
            NotificationPreference::firstOrCreate(
                ['user_id' => $student->id],
                [
                    'email' => true,
                    'in_app' => true,
                ]
            );
        }

        $this->command->info('Notification preferences seeded for all student users.');
    }
}
