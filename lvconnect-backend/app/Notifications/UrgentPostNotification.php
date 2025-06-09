<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use App\Models\SchoolUpdate;

class UrgentPostNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $schoolUpdate;

    /**
     * Create a new notification instance.
     */
    public function __construct(SchoolUpdate $schoolUpdate)
    {
        $this->schoolUpdate = $schoolUpdate;
    }

    /**
     * Determine which notification channels to use.
     */
    public function via($notifiable)
    {
        // $preferences = $notifiable->notificationPreference;

        // // Fallback to email if no preferences are set
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
        
         return ['database','mail'];
    }

    /**
     * Get the email representation of the notification.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Post Update: ' . $this->schoolUpdate->title)
            ->line('A post has been published:')
            ->line($this->schoolUpdate->title)
            ->action('View Post', env('VITE_APP_URL') . 'comms-admin/posts')
            ->line('Thank you for staying updated!');
    }

    /**
     * Get the database notification representation.
     */
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Post Published',
            'message' => 'A post titled "' . $this->schoolUpdate->title . '" has been published.',
            'url' => '/school-updates/' . $this->schoolUpdate->id
        ];
    }

    /**
     * Get the broadcast notification representation.
     */
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'title' => 'Urgent Post Published',
            'message' => 'An urgent post titled "' . $this->schoolUpdate->title . '" has been published.',
            'url' => '/school-updates/' . $this->schoolUpdate->id
        ]);
    }
}
