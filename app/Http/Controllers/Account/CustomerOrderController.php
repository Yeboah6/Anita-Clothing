<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Order;

class CustomerOrderController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $orders = Order::where('user_id', $user->id)
            ->with('items.product.images')
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->order_number,
                    'date' => $order->created_at->format('Y-m-d'),
                    'total' => $order->total_amount,
                    'status' => $order->status, // ⚠️ see note below
                    'tracking' => $order->tracking_number ?? null,
                    'items' => $order->items->map(function ($item) {
                        $imageUrl = null;

                        if ($item->product) {
                            $firstImage = $item->product->images->first();
                            $imageUrl = $firstImage->url ?? null; // ProductImage's url accessor
                        }

                        return [
                            'name' => $item->name,
                            'size' => $item->size,
                            'color' => $item->color,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                            'image' => $imageUrl,
                        ];
                    }),
                ];
            });

        return Inertia::render('Customer/AccountOrder', [
            'orders' => $orders,
        ]);
    }
}
