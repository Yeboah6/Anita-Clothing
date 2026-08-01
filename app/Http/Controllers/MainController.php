<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Wishlist;
use Inertia\Inertia;
use App\Models\OrderItem;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\{Auth, DB};
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Mail\ContactMessage;
use App\Models\Setting;
use Illuminate\Support\Facades\Mail;

class MainController extends Controller
{
    public function index()
    {
        $newArrivals = Product::with('images')
            ->where('status', 'active')
            ->where('created_at', '>=', now()->subDays(30))
            ->latest()
            ->take(4)
            ->get();

        if ($newArrivals->isEmpty()) {
            $newArrivals = Product::with('images')
                ->where('status', 'active')
                ->latest()
                ->take(4)
                ->get();
        }

        $newArrivals = $newArrivals->map(fn ($product) => $this->formatProduct($product));

        $categories = Category::withCount(['products' => function ($query) {
                $query->where('status', 'active');
            }])
            ->having('products_count', '>', 0)
            ->take(4)
            ->get()
            ->map(fn ($category) => $this->formatCategory($category));

        $collections = Category::all()->count();

        return inertia('Home', [
            'newArrivals' => $newArrivals,
            'categories' => $categories,
            'collections' => $collections,
            'reviews' => $this->getFeaturedReviews(),
            'reviewStats' => $this->getReviewStats(),
        ]);
    }

    public function collections()
    {
        $categories = Category::withCount(['products' => function ($query) {
                $query->where('status', 'active');
            }])
            ->having('products_count', '>', 0)
            ->orderBy('name')
            ->get()
            ->map(fn ($category) => $this->formatCategory($category));

        return inertia('Collections', [
            'categories' => $categories,
        ]);
    }

    public function newArrivals()
    {
        $products = Product::with('images')
            ->where('status', 'active')
            ->where('created_at', '>=', now()->subDays(30))
            ->latest()
            ->get()
            ->map(fn ($product) => $this->formatProduct($product));

        return inertia('NewArrivalsPage', [
            'products' => $products,
        ]);
    }

    public function about()
    {
        $collections = Category::all()->count();

        $reviews = Review::with('user')
            ->where('status', 'approved')
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'review' => $review->review,
                    'is_verified_purchase' => true, // every review requires a real order_item_id
                    'created_at' => $review->created_at,
                    'user' => [
                        'name' => trim(($review->user->first_name ?? '') . ' ' . ($review->user->last_name ?? ''))
                            ?: ($review->user->name ?? 'Anonymous'),
                    ],
                ];
            });

        $stats = [
            'average_rating' => round(Review::where('status', 'approved')->avg('rating') ?? 0, 1),
            'total_reviews' => Review::where('status', 'approved')->count(),
            'rating_distribution' => $this->getOverallRatingDistribution(),
        ];

        return inertia('About', [
            'collections' => $collections,
            'reviews' => $reviews,
            'stats' => $stats,
        ]);
    }

    public function product(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('status', 'active')
            ->with(['images', 'variants', 'category'])
            ->first();

        if (!$product) {
            return inertia('ProductDetail', [
                'product' => null,
            ]);
        }

        return inertia('ProductDetail', [
            'product' => $this->formatProductDetail($product),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id']);

        Wishlist::firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json(['status' => 'added']);
    }

    public function destroy(Request $request, $productId)
    {
        Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->delete();

        return response()->json(['status' => 'removed']);
    }

    public function category(string $slug)
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return inertia('Category', [
                'category' => null,
                'products' => [],
            ]);
        }

        $products = $category->products()
            ->where('status', 'active')
            ->with('images')
            ->latest()
            ->get()
            ->map(fn ($product) => $this->formatProduct($product));

        return inertia('Category', [
            'category' => [
                'id'    => $category->id,
                'name'  => $category->name,
                'slug'  => $category->slug,
                'image' => $products->first()['images'][0] ?? null,
            ],
            'products' => $products,
        ]);
    }

    private function formatProduct(Product $product): array
    {
        return [
            'id'           => $product->id,
            'name'         => $product->name,
            'slug'         => $product->slug,
            'price'        => (float) $product->price,
            'images'       => $product->images->pluck('url')->toArray(),
            'category_id'  => $product->category_id,
        ];
    }

    private function formatCategory(Category $category): array
    {
        $representativeImage = $category->products()
            ->where('status', 'active')
            ->with('images')
            ->first()
            ?->images
            ?->first()
            ?->url;

        return [
            'id'           => $category->id,
            'name'         => $category->name,
            'slug'         => $category->slug,
            'image'        => $representativeImage,
            'productCount' => $category->products_count,
        ];
    }

    private function formatProductDetail(Product $product): array
    {
        $variants = $product->variants;

        $sizes = $variants->pluck('size')->filter()->unique()->values()->toArray();
        $colors = $variants->pluck('color')->filter()->unique()->values()->toArray();

        $isNewArrival = $product->created_at >= now()->subDays(30);

        $relatedProducts = Product::with('images')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'active')
            ->take(4)
            ->get()
            ->map(fn ($related) => $this->formatProduct($related));

        return [
            'id'           => $product->id,
            'name'         => $product->name,
            'slug'         => $product->slug,
            'price'        => (float) $product->price,
            'description'  => $product->description,
            'stock_quantity' => $product->stock_quantity,
            'images'       => $product->images->pluck('url')->toArray(),
            'sizes'        => $sizes,
            'colors'       => $colors,
            'isNewArrival' => $isNewArrival,
            'category'     => $product->category ? [
                'id'   => $product->category->id,
                'name' => $product->category->name,
                'slug' => $product->category->slug,
            ] : null,
            'relatedProducts' => $relatedProducts,
        ];
    }

    public function storeReview(Request $request)
    {
        $validated = $request->validate([
            'orderId' => ['required'],
            'itemId'  => ['required', 'integer'],
            'rating'  => ['required', 'integer', 'min:1', 'max:5'],
            'review'  => ['required', 'string', 'min:10', 'max:1000'],
        ]);

        $user = Auth::user();

        $orderItem = OrderItem::with('order')->find($validated['itemId']);

        if (! $orderItem || ! $orderItem->order) {
            throw ValidationException::withMessages([
                'itemId' => 'This order item could not be found.',
            ]);
        }

        $order = $orderItem->order;

        if ((string) $order->user_id !== (string) $user->id) {
            throw ValidationException::withMessages([
                'itemId' => 'This order does not belong to your account.',
            ]);
        }

        if ($order->order_status !== 'delivered') {
            throw ValidationException::withMessages([
                'itemId' => 'You can only review items from delivered orders.',
            ]);
        }

        if (! $orderItem->product_id) {
            throw ValidationException::withMessages([
                'itemId' => 'This item is no longer linked to a product.',
            ]);
        }

        $existing = Review::where('order_item_id', $orderItem->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            throw ValidationException::withMessages([
                'itemId' => 'You have already reviewed this item.',
            ]);
        }

        $review = DB::transaction(function () use ($validated, $user, $order, $orderItem) {
            return Review::create([
                'user_id'       => $user->id,
                'order_id'      => $order->id,
                'order_item_id' => $orderItem->id,
                'product_id'    => $orderItem->product_id,
                'rating'        => $validated['rating'],
                'review'        => $validated['review'],
                'status'        => 'pending',
            ]);
        });

        return response()->json([
            'message' => 'Review submitted successfully.',
            'review'  => $review,
        ], 201);

    }

    public function contact()
    {
        $settings = Setting::allCached();
 
        return Inertia::render('Contact', [
            'store' => [
                'name'    => $settings->get('store_name', ''),
                'email'   => $settings->get('support_email', ''),
                'phone'   => $settings->get('support_phone', ''),
                'address' => $settings->get('store_address', ''),
            ],
        ]);
    }
 
    /**
     * Route: POST /contact
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'email'   => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
        ]);
 
        $settings = Setting::allCached();
        $supportEmail = $settings->get('support_email');
 
        if ($supportEmail) {
            Mail::to($supportEmail)->queue(new ContactMessage($validated));
        }
 
        return back()->with('success', "Thanks — we'll get back to you shortly.");
    }

        
    /**
     * Get overall rating distribution for all approved reviews.
     */
    private function getOverallRatingDistribution(): array
    {
        $counts = Review::where('status', 'approved')
            ->selectRaw('rating, count(*) as total')
            ->groupBy('rating')
            ->pluck('total', 'rating');
    
        return collect(range(1, 5))->mapWithKeys(fn ($r) => [$r => $counts[$r] ?? 0])->toArray();
    }

    private function getFeaturedReviews(int $limit = 6)
    {
        return Review::with('user')
            ->where('status', 'approved')
            ->latest()
            ->take($limit)
            ->get()
            ->map(fn ($review) => [
                'id' => $review->id,
                'rating' => $review->rating,
                'review' => $review->review,
                'created_at' => $review->created_at,
                'user' => [
                    'name' => trim(($review->user->first_name ?? '') . ' ' . ($review->user->last_name ?? ''))
                        ?: ($review->user->name ?? 'Anonymous'),
                ],
            ]);
    }

    private function getReviewStats(): array
    {
        return [
            'average_rating' => round(Review::where('status', 'approved')->avg('rating') ?? 0, 1),
            'total_reviews' => Review::where('status', 'approved')->count(),
        ];
    }
}
