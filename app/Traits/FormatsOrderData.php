<?php

namespace App\Traits;

use App\Models\Order;

trait FormatsOrderData
{
    protected function formatOrderForAdmin(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->order_status,
            'order_status' => $order->order_status,
            'payment_status' => $order->payment_status,
            'created_at' => $order->created_at,
            'notes' => $order->note,
            'subtotal' => $order->subtotal,
            'discount_amount' => $order->discount_amount ?? 0,
            'total' => $order->total_amount,
            'payment_method' => optional($order->payment)->provider,

            'customer' => [
                'name' => trim(($order->first_name ?? '') . ' ' . ($order->last_name ?? '')) ?: optional($order->user)->name,
                'email' => $order->email ?? optional($order->user)->email,
                'phone' => $order->phone ?? optional($order->user)->phone,
            ],

            'shipping_address' => [
                'line1' => $order->address,
                'line2' => $order->apartment,
                'city' => $order->city,
                'region' => $order->state,
                'postal_code' => $order->zip,
                'country' => 'Ghana',
            ],

            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'product_name' => $item->product->name ?? $item->product_name ?? 'Product',
                'image' => $item->product->images->first()->url ?? null,
                'size' => $item->size,
                'color' => $item->color,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'line_total' => $item->price * $item->quantity,
            ]),
        ];
    }

    protected function formatOrderCustomer(Order $order): array
    {
        if ($order->user) {
            $fullName = trim(($order->user->first_name ?? '') . ' ' . ($order->user->last_name ?? ''));

            return [
                'name'  => $fullName !== '' ? $fullName : ($order->user->email ?? 'Registered customer'),
                'email' => $order->user->email ?? null,
                'phone' => $order->user->phone ?? null,
            ];
        }

        return [
            'name'  => $order->guest_name ?? 'Guest',
            'email' => $order->guest_email ?? null,
            'phone' => $order->guest_phone ?? null,
        ];
    }

    protected function formatOrderAddress(Order $order): ?array
    {
        $address = $order->address;

        if (!$address) {
            return null;
        }

        if (is_string($address)) {
            $address = json_decode($address, true) ?? [];
        }

        return [
            'line1'       => $address['line1'] ?? null,
            'line2'       => $address['line2'] ?? null,
            'city'        => $address['city'] ?? null,
            'region'      => $address['region'] ?? $address['state'] ?? null,
            'postal_code' => $address['postal_code'] ?? $address['zip'] ?? null,
            'country'     => $address['country'] ?? null,
        ];
    }

    protected function formatOrderItem($item): array
    {
        $product = $item->product;

        return [
            'id'           => $item->id,
            'product_id'   => $item->product_id,
            'product_name' => $product->name ?? 'Product no longer available',
            'image'        => $product?->images?->first()?->url ?? null,
            'size'         => $item->size ?? null,
            'color'        => $item->color ?? null,
            'quantity'     => (int) $item->quantity,
            'price'        => (float) $item->price,
            'line_total'   => (float) $item->price * (int) $item->quantity,
        ];
    }

    protected function calculateSubtotal(Order $order): float
    {
        return $order->items->sum(fn ($item) => (float) $item->price * (int) $item->quantity);
    }
}