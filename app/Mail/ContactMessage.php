<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactMessage extends Mailable
{
    use Queueable, SerializesModels;

    public array $submission;

    public function __construct(array $submission)
    {
        $this->submission = $submission;
    }

    public function build()
    {
        return $this->subject('Contact form: ' . $this->submission['subject'])
            ->replyTo($this->submission['email'], $this->submission['name'])
            ->view('emails.contact-message');
    }
}