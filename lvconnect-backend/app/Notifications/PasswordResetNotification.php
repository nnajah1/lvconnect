<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class PasswordResetNotification extends Notification
{
    protected $resetLink;

    public function __construct($resetLink)
    {
        $this->resetLink = $resetLink;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Reset Your Password')
            ->line('You requested a password reset. Click the button below to set a new password.')
            ->action('Reset Password', $this->resetLink)
            ->line('This link will expire in 60 minutes.')
            ->line('If you didn’t request a password reset, you can safely ignore this email.');
    }
}
