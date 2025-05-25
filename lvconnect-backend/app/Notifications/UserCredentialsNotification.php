<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserCredentialsNotification extends Notification
{
    use Queueable;

    public $password;

    public function __construct($password)
    {
        $this->password = $password;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Your Admin Account Credentials')
            ->greeting('Hello ' . $notifiable->first_name)
            ->line('Your admin account has been created.')
            ->line('Email: ' . $notifiable->email)
            ->line('Temporary Password: ' . $this->password)
            ->line('Please log in and change your password immediately.');
    }
}

