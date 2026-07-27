<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewsletterWelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public NewsletterSubscriber $subscriber) {}

    public function build()
    {
        $unsubscribeUrl = route('newsletter.unsubscribe', $this->subscriber->unsubscribe_token);

        return $this->subject("You're on the list — CuteBloom")
            ->view('emails.newsletter-welcome', [
                'unsubscribeUrl' => $unsubscribeUrl,
            ]);
    }
}