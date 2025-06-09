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
        // Fallback: send email if no preferences
        // $preferences = $notifiable->notificationPreference;

        // if (!$preferences) {
        //     return ['mail'];
        // }

        // $channels = [];

        // if ($preferences->in_app) {
        //     $channels[] = 'database';
        //     $channels[] = 'broadcast';
        // }

        // if ($preferences->email) {
        //     $channels[] = 'mail';
        // }

        // return $channels;
        
         return ['database'];
    }

    /**
     * Email notification.
     */
    public function toMail($notifiable)
    {
        $status = $this->formSubmission->status;

        if (!in_array($status, ['approved', 'rejected'])) {
            return null;
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
     * Database notification (in-app).
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
     * Broadcast notification (real-time via websockets).
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
