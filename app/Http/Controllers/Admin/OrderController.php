<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Inertia\Inertia;
use App\Traits\FormatsOrderData;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{

    use FormatsOrderData;

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

    public function show($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->with('items.product.images', 'user')
            ->firstOrFail();
 
        return Inertia::render('Admin/Order/OrderDetails', [
            'order' => $this->formatOrderForAdmin($order),
        ]);
    }

    public function edit($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->with('items.product.images', 'user')
            ->firstOrFail();
 
        return Inertia::render('Admin/Order/EditOrder', [
            'order' => $this->formatOrderForAdmin($order),
        ]);
    }

    public function update(Request $request, $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();
 
        // ASSUMPTION: these are the editable fields per EditOrder.jsx.
        // Drop any rule here whose column doesn't exist yet on `orders`.
        $validated = $request->validate([
            'status'          => ['required', Rule::in(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])],
            'payment_status'  => ['nullable', Rule::in(['unpaid', 'paid', 'refunded'])],
            'tracking_number' => ['nullable', 'string', 'max:100'],
            'courier'         => ['nullable', 'string', 'max:100'],
            'admin_note'      => ['nullable', 'string', 'max:2000'],
        ]);
 
        $order->update($validated);
 
        return redirect()
            ->route('admin.orders.show', $order->order_number)
            ->with('success', 'Order updated.');
    }

    public function updateStatus(Request $request, $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();
 
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])],
        ]);
 
        $order->update($validated);
 
        return back()->with('success', 'Order status updated.');
    }
}
