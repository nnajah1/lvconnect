<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OTPNotification extends Notification
{
    use Queueable;

    protected $otp;
    protected $messageType;

    /**
     * Create a new notification instance.
     */
    public function __construct($otp, $messageType = 'default')
    {
        $this->otp = $otp;
        $this->messageType = $messageType;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $mail = (new MailMessage)
                    ->subject($this->getSubject())
                    ->greeting('Hello, ' . $notifiable->name . '!')
                    ->line($this->getMessage())
                    ->line('Your OTP Code is: **' . $this->otp . '**')
                    ->line('This OTP is valid for only 2 minutes. Do not share it with anyone.')
                    ->salutation('Thank you!');

        return $mail;
    }

    /**
     * Get the subject based on message type.
     */
    private function getSubject()
    {
        return match ($this->messageType) {
            'forgot_password' => 'Reset Your Password OTP',
            'new_password' => 'Confirm New Password OTP',
            'unrecognized_device' => 'Verify Your Login Attempt',
            default => 'Your OTP Code',
        };
    }

    /**
     * Get the message based on message type.
     */
    private function getMessage()
    {
        return match ($this->messageType) {
            'forgot_password' => 'We received a request to reset your password.',
            'new_password' => 'To set a new password, please verify with this OTP.',
            'unrecognized_device' => 'We detected a login attempt from a new device. If this was you, enter the OTP below.',
            default => 'Here is your one-time password for verification.',
        };
    }
}
