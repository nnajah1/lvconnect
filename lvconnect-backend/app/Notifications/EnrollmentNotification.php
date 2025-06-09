<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;

class EnrollmentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $academicYear;
    protected $semester;
    protected $isOpen;

    /**
     * Create a new notification instance.
     */
    public function __construct($academicYear, $semester, $isOpen)
    {
        $this->academicYear = $academicYear;
        $this->semester = $semester;
        $this->isOpen = $isOpen;
    }

    /**
     * Get the notification's delivery channels based on user preferences.
     */
    public function via(object $notifiable): array
    {
        // $prefs = $notifiable->notificationPreference;

        // // Default to true 
        // $emailEnabled = $prefs ? (bool) $prefs->email : true;
        // $inAppEnabled = $prefs ? (bool) $prefs->in_app : true;

        // $channels = [];

        // if ($emailEnabled) {
        //     $channels[] = 'mail';
        // }

        // if ($inAppEnabled) {
        //     $channels[] = 'database';
        //     $channels[] = 'broadcast';
        // }

        // \Log::info('EnrollmentNotification via()', [
        //     'user_id' => $notifiable->id,
        //     'channels' => $channels,
        // ]);

        // return $channels;
         return ['database','mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $status = $this->isOpen ? 'opened' : 'closed';

        return (new MailMessage)
            ->subject("Enrollment {$status}")
            ->line("Enrollment for {$this->semester} of Academic Year {$this->academicYear->school_year} has been {$status}.")
            ->line('Please visit the student portal for more details.');
    }

    /**
     * Get the array representation of the notification for in-app.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Enrollment ' . ($this->isOpen ? 'Opened' : 'Closed'),
            'message' => "Enrollment for {$this->semester} of Academic Year {$this->academicYear->school_year} has been " . ($this->isOpen ? 'opened' : 'closed') . ".",
        ];
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
