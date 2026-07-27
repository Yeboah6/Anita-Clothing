<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Wishlist;
use Inertia\Inertia;

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
            'collections' => $collections
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
        return inertia('About', [
            'collections' => $collections,
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
}
