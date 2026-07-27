<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterWelcomeEmail;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $subscriber = NewsletterSubscriber::where('email', $validated['email'])->first();

        // Already subscribed and active — treat as success, no duplicate email
        if ($subscriber && $subscriber->isActive()) {
            return back()->with('newsletter_status', 'already_subscribed');
        }

        // Previously unsubscribed — resubscribe them
        if ($subscriber) {
            $subscriber->update([
                'subscribed_at'   => now(),
                'unsubscribed_at' => null,
            ]);
        } else {
            $subscriber = NewsletterSubscriber::create([
                'email'              => $validated['email'],
                'unsubscribe_token'  => Str::random(48),
                'subscribed_at'      => now(),
            ]);
        }

        Mail::to($subscriber->email)->send(new NewsletterWelcomeEmail($subscriber));

        return back()->with('newsletter_status', 'subscribed');
    }

    public function unsubscribe(string $token)
    {
        $subscriber = NewsletterSubscriber::where('unsubscribe_token', $token)->firstOrFail();

        $subscriber->update(['unsubscribed_at' => now()]);

        return inertia('Newsletter/Unsubscribed');
    }
}