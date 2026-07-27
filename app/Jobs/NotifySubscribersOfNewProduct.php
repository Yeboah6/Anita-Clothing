<?php

namespace App\Jobs;

use App\Mail\NewProductAnnouncement;
use App\Models\NewsletterSubscriber;
use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class NotifySubscribersOfNewProduct implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Product $product) {}

    public function handle(): void
    {
        NewsletterSubscriber::whereNull('unsubscribed_at')
            ->chunkById(100, function ($subscribers) {
                foreach ($subscribers as $subscriber) {
                    Mail::to($subscriber->email)
                        ->send(new NewProductAnnouncement($this->product, $subscriber));
                }
            });
    }
}