<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewProductAnnouncement extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Product $product,
        public NewsletterSubscriber $subscriber
    ) {}

    public function build()
    {
        $image = $this->product->images->first()?->url;
        $unsubscribeUrl = route('newsletter.unsubscribe', $this->subscriber->unsubscribe_token);

        return $this->subject("New Arrival: {$this->product->name}")
            ->view('emails.new-product', [
                'product'         => $this->product,
                'image'           => $image,
                'unsubscribeUrl'  => $unsubscribeUrl,
            ]);
    }
}