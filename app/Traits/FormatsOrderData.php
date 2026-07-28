<?php

namespace App\Traits;

use App\Models\Order;

trait FormatsOrderData
{
    /**
     * Format a single Order for the admin ShowOrder / EditOrder pages.
     * Expects $order to already have `items.product` and `user` eager-loaded,
     * e.g. Order::with('items.product', 'user')->...
     */
    protected function formatOrderForAdmin(Order $order): array
    {
        return [
            'id'               => $order->id,
            'order_number'     => $order->order_number,
            'order_status'           => $order->order_status,
            'payment_status'   => $order->payment_status ?? null,
            'payment_method'   => $order->payment_method ?? null,

            'subtotal'         => (float) ($order->subtotal ?? $this->calculateSubtotal($order)),
            'discount_amount'  => (float) ($order->discount_amount ?? 0),
            // 'shipping_fee'     => (float) ($order->shipping_fee ?? 0),
            'total'            => (float) $order->total_amount,

            'tracking_number'  => $order->tracking_number ?? null,
            'courier'          => $order->courier ?? null,
            'admin_note'       => $order->admin_note ?? null,

            'created_at'       => $order->created_at,

            'customer'         => $this->formatOrderCustomer($order),
            'delivery_address' => $this->formatOrderAddress($order),
            'items'            => $order->items->map(fn ($item) => $this->formatOrderItem($item))->values(),
        ];
    }

    /**
     * Customer block. Registration collects first_name/last_name separately
     * (see AccountProfile / registration flow), so join them here rather
     * than assuming a single `name` column exists on users.
     */
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

        // ASSUMPTION: guest checkout stores contact details directly on the
        // order (guest_name / guest_email / guest_phone). Adjust to match
        // however guest orders are actually captured, or remove this branch
        // if guest checkout isn't supported.
        return [
            'name'  => $order->guest_name ?? 'Guest',
            'email' => $order->guest_email ?? null,
            'phone' => $order->guest_phone ?? null,
        ];
    }

    /**
     * ASSUMPTION: delivery address is stored as a JSON/array column called
     * `delivery_address` on the orders table with keys line1/line2/city/
     * region/postal_code/country. If yours uses separate flat columns
     * (delivery_city, delivery_postal_code, etc.) or a related
     * `addresses` table, replace the body of this method accordingly.
     */
    protected function formatOrderAddress(Order $order): ?array
    {
        $address = $order->delivery_address;

        if (!$address) {
            return null;
        }

        // Support both a cast array and a raw JSON string just in case
        // the column isn't cast to `array` on the model yet.
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

    /**
     * Single order item row. `size`/`color` are read off the order_item
     * itself (a snapshot at purchase time) rather than the live product/
     * variant, since variants can change or be deleted after the sale.
     */
    protected function formatOrderItem($item): array
    {
        $product = $item->product;

        return [
            'id'           => $item->id,
            'product_id'   => $item->product_id,
            'product_name' => $product->name ?? 'Product no longer available',
            // ProductImage already appends a `url` accessor — reuse it.
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