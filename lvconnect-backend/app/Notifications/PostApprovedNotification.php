<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\SchoolUpdate;

class PostApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $post;

    public function __construct(SchoolUpdate $post)
    {
        $this->post = $post;
    }

    public function via($notifiable)
    {
        return ['mail', 'database', 'broadcast']; // Send via email, store in database, and broadcast event
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Post Approved: ' . $this->post->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your post titled **' . $this->post->title . '** has been approved by the school admin.')
            ->action('View Post', url('/school-updates/' . $this->post->id))
            ->line('Thank you for your contribution!');
    }

    public function toDatabase($notifiable)
    {
        return [
            'post_id' => $this->post->id,
            'title' => $this->post->title,
            'message' => 'Your post "' . $this->post->title . '" has been approved.',
            'link' => url('/school-updates/' . $this->post->id),
        ];
    }

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
