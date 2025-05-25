<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use App\Models\SchoolUpdate;

class PostApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $post;

    public function __construct(SchoolUpdate $post)
    {
        $this->post = $post;
    }

    /**
     * Determine which notification channels to use.
     */
    public function via($notifiable)
    {
        $preferences = $notifiable->notificationPreference;

        // Fallback to email if no preferences exist
        if (!$preferences) {
            return ['mail'];
        }

        $channels = [];

        if ($preferences->in_app) {
            $channels[] = 'database';
            $channels[] = 'broadcast';
        }

        if ($preferences->email) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    /**
     * Email notification.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Post Approved: ' . $this->post->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your post titled "' . $this->post->title . '" has been approved by the school admin.')
            ->action('View Post', url('/school-updates/' . $this->post->id))
            ->line('Thank you for your contribution!');
    }

    /**
     * Database (in-app) notification.
     */
    public function toDatabase($notifiable)
    {
        return [
            'post_id' => $this->post->id,
            'title' => $this->post->title,
            'message' => 'Your post "' . $this->post->title . '" has been approved.',
            'link' => url('/school-updates/' . $this->post->id),
        ];
    }

    /**
     * Broadcast (real-time) notification.
     */
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'post_id' => $this->post->id,
            'title' => $this->post->title,
            'message' => 'Your post "' . $this->post->title . '" has been approved.',
            'link' => url('/school-updates/' . $this->post->id),
        ]);
    }
}
