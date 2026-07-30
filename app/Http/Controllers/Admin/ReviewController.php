<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Review;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');

        $query = Review::with(['user:id,name', 'order:id,order_number', 'product:id,name'])
            ->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $reviews = $query->paginate(20)->withQueryString();
        

        $formattedReviews = $reviews->through(fn ($review) => [
            'id' => $review->id,
            'rating' => $review->rating,
            'review' => $review->review,
            'status' => $review->status,
            'created_at' => $review->created_at->format('M d, Y'),
            'customer_name' => $review->user->name ?? 'Unknown customer',
            'product_name' => $review->product->name ?? 'Product no longer available',
            'order_number' => $review->order->order_number ?? '—',
        ]);

        return inertia('Admin/Reviews/Index', [
            'reviews' => $formattedReviews->items(),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'total' => $reviews->total(),
            ],
            'filters' => [
                'status' => $status,
            ],
            'counts' => [
                'all' => Review::count(),
                'pending' => Review::where('status', 'pending')->count(),
                'approved' => Review::where('status', 'approved')->count(),
                'rejected' => Review::where('status', 'rejected')->count(),
            ],
        ]);
    }

    public function updateStatus(Request $request, Review $review)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,approved,rejected'],
        ]);

        $review->update(['status' => $validated['status']]);

        return back()->with('success', 'Review status updated.');
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return back()->with('success', 'Review deleted.');
    }
}