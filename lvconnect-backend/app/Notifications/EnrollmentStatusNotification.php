<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

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
     * Get the notification's delivery channels based on user preferences.
     */
    public function via(object $notifiable): array
    {
        $prefs = $notifiable->notificationPreference;

        $channels = [];

        if ($prefs?->email) {
            $channels[] = 'mail';
        }

        if ($prefs?->in_app) {
            $channels[] = 'database';
        }

        // Fallback to mail if no preferences are set
        if (empty($channels)) {
            $channels = ['mail'];
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        switch ($this->status) {
            case 'enrolled':
                return (new MailMessage)
                    ->subject("You're officially enrolled!")
                    ->line("Congratulations! You have been officially enrolled for Academic Year {$this->academicYear->school_year}.")
                    ->line('Please check your student portal for confirmation and next steps.');

            case 'rejected':
                return (new MailMessage)
                    ->subject("Enrollment Application: Temporary Enrolled")
                    ->line("Your enrollment application has been marked as temporary enrolled for Academic Year {$this->academicYear->school_year}.")
                    ->line('Please check your student portal for more details or contact the registrar for assistance.');

            case 'not_enrolled':
                return (new MailMessage)
                    ->subject("Enrollment Application Reminder")
                    ->line("Reminder! You have not yet enrolled for Academic Year {$this->academicYear->school_year}.")
                    ->line('Please log in to your student portal to begin the enrollment process or contact the registrar for assistance.');

            case 'remind_rejected':
                return (new MailMessage)
                    ->subject("Enrollment Application Reminder")
                    ->line("Reminder! Kindly submit all your incomplete requirements for Academic Year {$this->academicYear->school_year}.")
                    ->line('Please check your student portal for more details or contact the registrar for assistance.');

            case 'archived':
                return (new MailMessage)
                    ->subject("Archived Account")
                    ->line("Please be informed that your account has been archived and you no longer have access to the system.");

            default:
                return (new MailMessage)
                    ->subject('Enrollment Status Update')
                    ->line('Your enrollment status has been updated.')
                    ->line('Please check your student portal for details.');
        }
    }

    /**
     * Get the array representation of the notification (for in-app).
     */
    public function toArray(object $notifiable): array
    {
        $message = match ($this->status) {
            'enrolled' => "You have been officially enrolled for Academic Year {$this->academicYear->school_year}.",
            'rejected' => "Your enrollment application for Academic Year {$this->academicYear->school_year} has been rejected.",
            'not_enrolled' => "Reminder! You have not yet enrolled for Academic Year {$this->academicYear->school_year}.",
            'remind_rejected' => "Reminder! Please reprocess your enrollment application for Academic Year {$this->academicYear->school_year}.",
            'archived' => "Please be informed that your account has been archived and you no longer have access to the system.",
            default => 'Your enrollment status has been updated.',
        };

        return [
            'status' => $this->status,
            'message' => $message,
        ];
    }
}
