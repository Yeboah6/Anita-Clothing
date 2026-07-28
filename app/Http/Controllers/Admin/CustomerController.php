<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\User;

class CustomerController extends Controller
{
    public function Index() {

        $customers = User::where('role', 'customer')
            ->withCount('orders')
            ->withSum('orders', 'total_amount') // Assuming your orders table has total_amount field
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'joined' => $user->created_at->format('Y-m-d'),
                    'orders_count' => $user->orders_count ?? 0,
                    'total_spent' => $user->orders_sum_total_amount ?? 0,
                    'status' => $user->email_verified_at ? 'active' : 'inactive',
                    'avatar' => null, // You can add avatar later
                    'last_order_at' => optional($user->orders()->latest()->first())->created_at?->format('Y-m-d'),
                ];
            });

        // Calculate summary statistics
        $stats = [
            'total_customers' => $customers->count(),
            'active_customers' => $customers->where('status', 'active')->count(),
            'total_revenue' => $customers->sum('total_spent'),
            'average_order_value' => $customers->count() > 0 
                ? $customers->sum('total_spent') / $customers->count() 
                : 0,
        ];

        return Inertia::render('Admin/AdminCustomers', [
            'customers' => $customers,
            'stats' => $stats,
        ]);
    }

    public function show(User $customer)
    {
        $orders = $customer->orders()->latest()->get()->map(fn ($order) => [
            'id' => $order->id,
            'order_number' => $order->order_number ?? $order->id,
            'date' => $order->created_at->format('M d, Y'),
            'items_count' => $order->items()->count(),
            'total' => $order->total_amount,
            'order_status' => $order->order_status,
        ]);

        return Inertia::render('Admin/Customer/ShowCustomer', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'status' => $customer->status,
                'joined' => optional($customer->created_at)->format('M d, Y') ?? 'N/A',
                'orders_count' => $orders->count(),
                'total_spent' => $customer->total_spent,
                'last_order_at' => optional($orders->first())['date'] ?? null,
            ],
            'orders' => $orders,
            'addresses' => $customer->addresses()->get()->map(fn ($a) => [
                'id' => $a->id,
                'label' => $a->label,
                'street' => $a->street,
                'city' => $a->city,
                'region' => $a->region,
                'country' => $a->country,
                'is_default' => $a->is_default,
            ]),
            'wishlist' => $customer->wishlists()->with('product')->get()->map(fn ($w) => [
                'id' => $w->id,
                'name' => $w->product->name ?? 'Product',
                'price' => $w->product->price ?? 0,
                'image_url' => $w->product->url ?? null,
            ]),
        ]);
    }
}
