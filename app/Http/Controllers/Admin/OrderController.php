<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('user')
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->order_number,
                    'customer' => trim($order->first_name . ' ' . $order->last_name),
                    'email' => $order->email,
                    'date' => $order->created_at->format('Y-m-d'),
                    'total' => $order->total_amount,
                    'status' => $order->order_status,
                    'items' => $order->items()->count(),
                ];
            });

        return Inertia::render('Admin/AdminOrders', [
            'orders' => $orders,
        ]);
    }
}
