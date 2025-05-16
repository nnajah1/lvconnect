<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\SchoolUpdate;
use App\Models\FormSubmission;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            SchoolUpdate::where('status', SchoolUpdate::STATUS_REJECTED)
                ->where('rejected_at', '<', Carbon::now()->subDays(3))
                ->delete();
        })->daily(); // Runs once per day
        $schedule->call(function () {
            SchoolUpdate::where('status', SchoolUpdate::STATUS_ARCHIVED)
                ->where('archived_at', '<=', now()->subDays(7))
                ->delete();
        })->daily();

        // Cleanup for rejected form submissions
        $schedule->call(function () {
            FormSubmission::where('status', 'rejected')
                ->where('rejected_at', '<', Carbon::now()->subDays(3))
                ->delete();
        })->daily();

        // Sync data from Dummy System API
        $schedule->call(function () {
            try {
                $response = Http::withToken(env('DUMMY_API_TOKEN'))
                    ->get(env('DUMMY_API_URL') . '/api/applicants');

                if ($response->successful()) {
                    app(\App\Http\Controllers\DummyDataSyncController::class)->sync();
                    Log::info('Dummy data synced successfully.');
                } else {
                    Log::warning('Dummy sync failed: ' . $response->body());
                }
            } catch (\Exception $e) {
                Log::error('Exception during dummy sync: ' . $e->getMessage());
            }
        })->monthly();

    }

    /**
     * Register the commands for the application.
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
