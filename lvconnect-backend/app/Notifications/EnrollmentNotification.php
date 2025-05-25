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
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
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
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
