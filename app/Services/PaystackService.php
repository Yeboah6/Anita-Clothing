<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaystackService
{
    protected string $secretKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->secretKey = config('services.paystack.secret_key');
        $this->baseUrl = config('services.paystack.payment_url');
    }

    protected function client()
    {
        return Http::withToken($this->secretKey)->baseUrl($this->baseUrl);
    }

    /**
     * Initialize a transaction. Amount must be in kobo (or the smallest
     * currency unit) — Paystack expects NGN * 100.
     */
    public function initializeTransaction(array $data): array
    {
        $payload = [
            'email' => $data['email'],
            'amount' => (int) round($data['amount'] * 100),
            'currency' => $data['currency'] ?? 'NGN',
            'reference' => $data['reference'] ?? Str::uuid()->toString(),
            'callback_url' => $data['callback_url'] ?? route('payment.callback'),
            'metadata' => $data['metadata'] ?? [],
        ];

        $response = $this->client()->post('/transaction/initialize', $payload);

        if (! $response->successful()) {
            throw new \RuntimeException(
                'Paystack initialize failed: ' . $response->body()
            );
        }

        return $response->json();
    }

    public function verifyTransaction(string $reference): array
    {
        $response = $this->client()->get("/transaction/verify/{$reference}");

        if (! $response->successful()) {
            throw new \RuntimeException(
                'Paystack verify failed: ' . $response->body()
            );
        }

        return $response->json();
    }
}