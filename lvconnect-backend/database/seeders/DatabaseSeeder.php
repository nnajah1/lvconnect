<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\UserRoleSeeder;
use Database\Seeders\superAdminSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call([
            // PermissionSeeder::class,
            UserRoleSeeder::class,
            UserSeeder::class,
            StudentInformationSeeder::class,
            StudentFamilyInformationSeeder::class,
            ProgramSeeder::class,
            AcademicYearSeeder::class,
            EnrollmentScheduleSeeder::class,
            EnrolleeRecordSeeder::class,
            SchoolUpdateSeeder::class,
            FormTypeSeeder::class,
            FormFieldSeeder::class,
            //FormSubmissionSeeder::class,
            //FormSubmissionDataSeeder::class,
            SurveySeeder::class,
            SOASeeder::class,
            NotificationPreferenceSeeder::class,
        ]);
    }
}
