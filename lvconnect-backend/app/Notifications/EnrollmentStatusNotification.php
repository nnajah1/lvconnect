<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EnrollmentStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected string $status;
    protected $academicYear;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $status, $academicYear)
    {
        $this->status = $status;
        $this->academicYear = $academicYear;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        if ($this->status === 'enrolled') {
            return (new MailMessage)
                ->subject("You're officially enrolled!")
                ->line("Congratulations! You have been officially enrolled for Academic Year {$this->academicYear->school_year}.")
                ->line('Please check your student portal for confirmation and next steps.');
        }

        if ($this->status === 'rejected') {
            return (new MailMessage)
                ->subject("Enrollment Application Rejected")
                ->line("We regret to inform you that your enrollment application for Academic Year {$this->academicYear->school_year} has been rejected.")
                ->line('Please check your student portal for more details or contact the registrar for assistance.');
        }

        if ($this->status === 'not_enrolled') {
            return (new MailMessage)
                ->subject("Enrollment Application Reminder")
                ->line("Reminder! You have not yet enrolled for Academic Year {$this->academicYear->school_year}.")
                ->line('Please log in to your student portal to begin the enrollment process or contact the registrar for assistance.');
        }

        if ($this->status === 'remind_rejected') {
            return (new MailMessage)
                ->subject("Enrollment Application Reminder")
                ->line("Reminder! Please reprocess your enrollment application for Academic Year {$this->academicYear->school_year}.")
                ->line('Please check your student portal for more details or contact the registrar for assistance.');
        }

        return (new MailMessage)
            ->subject('Enrollment Status Update')
            ->line('Your enrollment status has been updated.')
            ->line('Please check your student portal for details.');
    }

    /**
     * Get the array representation of the notification (for database/in-app).
     */
    public function toArray(object $notifiable): array
    {
        $message = match ($this->status) {
            'enrolled' => "You have been officially enrolled for Academic Year {$this->academicYear->school_year}.",
            'rejected' => "Your enrollment application for Academic Year {$this->academicYear->school_year} has been rejected.",
            'not_enrolled' => "Reminder! You have not yet enrolled for Academic Year {$this->academicYear->school_year}.",
            'remind_rejected' => "Reminder! Please reprocess your enrollment application for Academic Year {$this->academicYear->school_year}.",
            default => 'Your enrollment status has been updated.',
        };

        return [
            'status' => $this->status,
            'message' => $message,
        ];
    }
}
