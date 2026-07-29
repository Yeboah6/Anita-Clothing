<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $startOfThisMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        return inertia('Admin/AdminOverview', [
            'stats'        => $this->getStats($startOfThisMonth, $startOfLastMonth, $endOfLastMonth),
            'salesData'    => $this->getSalesData(),
            'topProducts'  => $this->getTopProducts(),
            'recentOrders' => $this->getRecentOrders(),
        ]);
    }

    private function calcChange($current, $previous): array
    {
        if ($previous == 0) {
            $pct = $current > 0 ? 100 : 0;
        } else {
            $pct = round((($current - $previous) / $previous) * 100, 1);
        }

        return [
            'change' => ($pct >= 0 ? '+' : '') . $pct . '%',
            'trend'  => $pct >= 0 ? 'up' : 'down',
        ];
    }

    private function getStats($startOfThisMonth, $startOfLastMonth, $endOfLastMonth): array
    {
        // Revenue
        $revenueThisMonth = Order::where('created_at', '>=', $startOfThisMonth)
            ->sum('total_amount');

        $revenueLastMonth = Order::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('total_amount');

        $totalRevenue = Order::all()->sum('total_amount');

        // Orders
        $ordersThisMonth = Order::where('created_at', '>=', $startOfThisMonth)->count();
        $ordersLastMonth = Order::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $totalOrders = Order::count();

        // Customers
        $customersThisMonth = User::where('role', 'customer')->where('created_at', '>=', $startOfThisMonth)->count();
        $customersLastMonth = User::where('role', 'customer')->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $totalCustomers = User::where('role', 'customer')->count();

        // Products
        $productsAsOfLastMonth = Product::where('created_at', '<', $startOfThisMonth)->count();
        $totalProducts = Product::count();

        $revenueChange = $this->calcChange($revenueThisMonth, $revenueLastMonth);
        $ordersChange = $this->calcChange($ordersThisMonth, $ordersLastMonth);
        $customersChange = $this->calcChange($customersThisMonth, $customersLastMonth);
        $productsChange = $this->calcChange($totalProducts, $productsAsOfLastMonth);

        return [
            [
                'label'  => 'Total Revenue',
                'value'  => '₵' . number_format($totalRevenue, 0),
                'change' => $revenueChange['change'],
                'trend'  => $revenueChange['trend'],
            ],
            [
                'label'  => 'Orders',
                'value'  => number_format($totalOrders),
                'change' => $ordersChange['change'],
                'trend'  => $ordersChange['trend'],
            ],
            [
                'label'  => 'Customers',
                'value'  => number_format($totalCustomers),
                'change' => $customersChange['change'],
                'trend'  => $customersChange['trend'],
            ],
            [
                'label'  => 'Products',
                'value'  => number_format($totalProducts),
                'change' => $productsChange['change'],
                'trend'  => $productsChange['trend'],
            ],
        ];
    }

    private function getSalesData(): array
    {
        $months = collect();
        $cursor = Carbon::now()->subMonths(11)->startOfMonth();

        for ($i = 0; $i < 12; $i++) {
            $months->push($cursor->copy());
            $cursor->addMonth();
        }

        $raw = Order::where('created_at', '>=', Carbon::now()->subMonths(11)->startOfMonth())
            ->selectRaw('YEAR(created_at) as y, MONTH(created_at) as m, SUM(total_amount) as revenue')
            ->groupBy('y', 'm')
            ->get()
            ->keyBy(fn ($row) => $row->y . '-' . $row->m);

        return $months->map(function ($month) use ($raw) {
            $key = $month->year . '-' . $month->month;
            return [
                'month'   => $month->format('M'),
                'revenue' => (float) ($raw[$key]->revenue ?? 0),
            ];
        })->values()->toArray();
    }

    private function getTopProducts(): array
    {
        return OrderItem::select('product_id')
            ->selectRaw('SUM(quantity) as sold')
            ->selectRaw('SUM(quantity * price) as revenue')
            ->with('product:id,name')
            ->groupBy('product_id')
            ->orderByDesc('revenue')
            ->take(5)
            ->get()
            ->map(fn ($row) => [
                'name'    => $row->product->name ?? 'Unknown product',
                'sold'    => (int) $row->sold,
                'revenue' => (float) $row->revenue,
            ])
            ->toArray();
    }

    private function getRecentOrders(): array
    {
        return Order::with('user:id,name')
            ->latest()
            ->take(6)
            ->get()
            ->map(fn ($order) => [
                'id'       => $order->order_number,
                'customer' => $order->user->name ?? 'Guest',
                'date'     => $order->created_at->format('Y-m-d'),
                'status'   => $order->order_status,
                'total'    => (float) $order->total_amount,
            ])
            ->toArray();
    }
}