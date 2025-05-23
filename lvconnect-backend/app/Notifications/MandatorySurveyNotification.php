<?php

namespace App\Notifications;

use App\Models\Survey;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;

class MandatorySurveyNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $survey;

    public function __construct(Survey $survey)
    {
        $this->survey = $survey;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Mandatory Survey: ' . $this->survey->title)
            ->greeting('Hello!')
            ->line('A new mandatory survey has been created: ' . $this->survey->title)
            ->line('Description: ' . ($this->survey->description ?? 'No description provided.'))
            ->action('Complete Survey', url('/surveys/' . $this->survey->id))
            ->line('Please complete this survey as soon as possible.');
    }
}
