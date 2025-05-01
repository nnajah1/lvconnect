<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use App\Models\FormSubmission;

class FormNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $formSubmission;

    /**
     * Create a new notification instance.
     */
    public function __construct(FormSubmission $formSubmission)
    {
        $this->formSubmission = $formSubmission;
    }

    /**
     * Determine which notification channels to use.
     */
    public function via($notifiable)
    {
        $channels = ['database']; // Always store in-app notification

        if ($notifiable->notify_via_email) {
            $channels[] = 'mail'; // Include email if preferred
        }

        return $channels;
    }

    /**
     * Email notification.
     */
    public function toMail($notifiable)
    {
        $status = $this->formSubmission->status;

        if (!in_array($status, ['approved', 'rejected'])) {
            return null; // Don't send email for other statuses
        }

        $message = $status === 'approved'
            ? 'Your form submission has been approved.'
            : 'Your form submission has been rejected.';

        return (new MailMessage)
            ->subject("Form Submission {$status}")
            ->line($message)
            ->action('View Submission', url('/student/forms/' . $this->formSubmission->id))
            ->line('Thank you for using our student portal!');
    }

    /**
     * Database notification.
     */
    public function toDatabase($notifiable)
    {
        $status = $this->formSubmission->status;

        if (!in_array($status, ['approved', 'rejected'])) {
            return [];
        }

        $message = $status === 'approved'
            ? 'Your form submission has been approved.'
            : 'Your form submission has been rejected.';

        return [
            'title' => "Form Submission {$status}",
            'message' => $message,
            'url' => '/student/forms/' . $this->formSubmission->id,
        ];
    }

    /**
     * Broadcast notification (optional).
     */
    public function toBroadcast($notifiable)
    {
        $status = $this->formSubmission->status;

        if (!in_array($status, ['approved', 'rejected'])) {
            return;
        }

        $message = $status === 'approved'
            ? 'Your form submission has been approved.'
            : 'Your form submission has been rejected.';

        return new BroadcastMessage([
            'title' => "Form Submission {$status}",
            'message' => $message,
            'url' => '/student/forms/' . $this->formSubmission->id,
        ]);
    }
}
