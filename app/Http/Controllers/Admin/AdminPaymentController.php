<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class AdminPaymentController extends Controller
{
    /**
     * Shared filter application so index() and export() never drift apart.
     */
    protected function applyFilters(Request $request)
    {
        $query = Payment::query()->with(['order', 'user']);

        $dateFrom = $request->input('date_from');
        $dateTo   = $request->input('date_to');
        $status   = $request->input('status');
        $method   = $request->input('method');

        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($method && $method !== 'all') {
            $query->where('method', $method);
        }

        return $query;
    }

    public function index(Request $request)
    {
        $filters = [
            'date_from' => $request->input('date_from', now()->subDays(30)->toDateString()),
            'date_to'   => $request->input('date_to', now()->toDateString()),
            'status'    => $request->input('status', 'all'),
            'method'    => $request->input('method', 'all'),
        ];

        $request->merge($filters);

        $transactions = $this->applyFilters($request)
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        $summaryQuery = $this->applyFilters($request);

        $summary = [
            'total_revenue' => (clone $summaryQuery)->where('status', 'success')->sum('amount'),
            'total_transactions' => (clone $summaryQuery)->count(),
            'avg_transaction' => (clone $summaryQuery)->where('status', 'success')->avg('amount') ?? 0,
            'refunded_amount' => (clone $summaryQuery)->where('status', 'refunded')->sum('amount'),
            'failed_count' => (clone $summaryQuery)->where('status', 'failed')->count(),
        ];

        $revenueOverTime = (clone $summaryQuery)
            ->where('status', 'success')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(amount) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $methodBreakdown = (clone $summaryQuery)
            ->select('channel', DB::raw('COUNT(*) as count'), DB::raw('SUM(amount) as total'))
            ->groupBy('channel')
            ->get();

        $statusBreakdown = (clone $summaryQuery)
            ->select('status', DB::raw('COUNT(*) as count'), DB::raw('SUM(amount) as total'))
            ->groupBy('status')
            ->get();

        return Inertia::render('Admin/Payment/PaymentReport', [
            'transactions' => $transactions,
            'summary' => $summary,
            'revenueOverTime' => $revenueOverTime,
            'methodBreakdown' => $methodBreakdown,
            'statusBreakdown' => $statusBreakdown,
            'filters' => $filters,
            'indexUrl' => route('admin.payments.index'),
            'exportUrl' => route('admin.payments.export', request()->only(['date_from', 'date_to', 'status', 'channel']))
        ]);
    }

    public function export(Request $request)
    {
        $payments = $this->applyFilters($request)
            ->orderByDesc('created_at')
            ->get();

        $filename = 'payment-report-' . now()->format('Y-m-d-His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        return Response::stream(function () use ($payments) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Transaction ID',
                'Order Number',
                'Customer',
                'Email',
                'Amount',
                'Method',
                'Status',
                'Date',
            ]);

            foreach ($payments as $payment) {
                fputcsv($handle, [
                    $payment->reference,
                    $payment->order->order_number ?? $payment->order_id,
                    $payment->user->name ?? 'Guest',
                    $payment->user->email ?? '',
                    number_format($payment->amount, 2, '.', ''),
                    $payment->channel,
                    $payment->status,
                    $payment->created_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }
}