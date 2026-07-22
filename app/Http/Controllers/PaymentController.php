<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Services\PaystackService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct(protected PaystackService $paystack)
    {}

    /**
     * Show the checkout/payment page for a given order.
     */
    public function checkout(Order $order)
    {
        return Inertia::render('Checkout/Payment', [
            'order' => [
                'id' => $order->id,
                'total_amount' => $order->total_amount,
                'currency' => 'GHS',
            ],
            'paystackPublicKey' => config('services.paystack.public_key'),
        ]);
    }

    /**
     * Initialize a Paystack transaction and return the authorization URL.
     */
    public function initialize(Request $request, Order $order)
    {
        $user = Auth::user();

        $reference = 'anita_' . Str::uuid()->toString();

        $payment = Payment::create([
            'order_id' => $order->id,
            'user_id' => $user?->id,
            'reference' => $reference,
            'amount' => $order->total_amount,
            'currency' => 'GHS',
            'provider' => 'paystack',
            'status' => 'pending',
        ]);

        try {
            $result = $this->paystack->initializeTransaction([
                'email' => $user->email ?? $request->input('email'),
                'amount' => $order->total_amount,
                'reference' => $reference,
                'metadata' => [
                    'order_id' => $order->id,
                    'payment_id' => $payment->id,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Paystack initialize error', ['error' => $e->getMessage()]);
            $payment->update(['status' => 'failed']);

            return back()->withErrors([
                'payment' => 'Could not start payment. Please try again.',
            ]);
        }

        $payment->update([
            'paystack_access_code' => $result['data']['access_code'] ?? null,
        ]);

        return Inertia::location($result['data']['authorization_url']);
    }

    /**
     * Paystack redirects here after the customer completes/cancels payment.
     */
    public function callback(Request $request)
    {
        $reference = $request->query('reference') ?? $request->query('trxref');

        if (! $reference) {
            return redirect()->route('cart')->withErrors([
                'payment' => 'Missing payment reference.',
            ]);
        }

        $payment = Payment::where('reference', $reference)->firstOrFail();

        try {
            $result = $this->paystack->verifyTransaction($reference);
        } catch (\Throwable $e) {
            Log::error('Paystack verify error', ['error' => $e->getMessage()]);
            return redirect()->route('checkout.failed', $payment->order_id);
        }

        $status = $result['data']['status'] ?? 'failed';

        DB::transaction(function () use ($payment, $result, $status) {
            $payment->update([
                'status' => $status === 'success' ? 'success' : 'failed',
                'channel' => $result['data']['channel'] ?? null,
                'gateway_response' => $result['data'],
                'paid_at' => $status === 'success' ? now() : null,
            ]);

            if ($status === 'success') {
                $payment->order->update(['status' => 'paid']);
            }
        });

        if ($status === 'success') {
            return redirect()->route('checkout.success', $payment->order_id);
        }

        return redirect()->route('checkout.failed', $payment->order_id);
    }

    /**
     * Optional: Paystack webhook for server-to-server confirmation,
     * in case the customer closes the tab before the callback fires.
     */
    public function webhook(Request $request)
    {
        $signature = $request->header('x-paystack-signature');
        $secret = config('services.paystack.secret_key');
        $computed = hash_hmac('sha512', $request->getContent(), $secret);

        if (! hash_equals($computed, (string) $signature)) {
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        $event = $request->input('event');
        $data = $request->input('data');

        if ($event === 'charge.success') {
            $payment = Payment::where('reference', $data['reference'] ?? null)->first();

            if ($payment && $payment->status !== 'success') {
                DB::transaction(function () use ($payment, $data) {
                    $payment->update([
                        'status' => 'success',
                        'channel' => $data['channel'] ?? null,
                        'gateway_response' => $data,
                        'paid_at' => now(),
                    ]);
                    $payment->order->update(['status' => 'paid']);
                });
            }
        }

        return response()->json(['message' => 'ok']);
    }

    public function success(Order $order)
    {
        $payment = Payment::where('order_id', $order->id)
            ->where('status', 'success')
            ->latest()
            ->first();
    
        return Inertia::render('Checkout/Success', [
            'order' => [
                'id' => $order->id,
                'total_amount' => $order->total_amount,
            ],
            'payment' => $payment ? [
                'reference' => $payment->reference,
                'channel' => $payment->channel,
                'paid_at' => $payment->paid_at,
            ] : null,
        ]);
    }

    /**
     * Show the failed page for an order whose payment did not succeed.
     */
    public function failed(Order $order)
    {
        $payment = Payment::where('order_id', $order->id)
            ->latest()
            ->first();

        return Inertia::render('Checkout/Failed', [
            'order' => [
                'id' => $order->id,
                'total_amount' => $order->total_amount,
            ],
            'payment' => $payment ? [
                'reference' => $payment->reference,
                'status' => $payment->status,
            ] : null,
        ]);
    }
}