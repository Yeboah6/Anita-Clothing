<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use Illuminate\Support\Facades\{Storage, DB};
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'images', 'variants'])
            ->latest()
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => (float) $product->price,
                    'discount_amount' => (float) $product->discount_amount,
                    'sku' => $product->sku,
                    'description' => $product->description,
                    'status' => $product->status,
                    'featured' => (bool) $product->featured,
                    'stock_quantity' => $product->stock_quantity,
                    'category' => $product->category?->name ?? 'Uncategorized',
                    'is_new_arrival' => $product->created_at->gt(now()->subDays(30)),
                    'images' => $product->images->map(
                        fn ($img) => asset('storage/' . $img->image)
                    )->values(),
                ];
            });

        $categories = Category::withCount('products')->get();

        return inertia('Admin/AdminProducts', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create() {
        $categories = Category::all();
        return inertia('Admin/Product/AddProduct', [
            'categories' => $categories
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();

        $product = DB::transaction(function () use ($validated, $request) {
            $product = Product::create([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'slug' => Product::generateUniqueSlug($validated['name']),
                'price' => $validated['price'],
                'discount_amount' => $validated['discount_amount'] ?? 0,
                'stock_quantity' => $validated['stock_quantity'] ?? 0,
                'sku' => $validated['sku'],
                'description' => $validated['description'],
                'featured' => $validated['featured'] ?? false,
                'status' => $validated['status'],
            ]);

            foreach ($validated['variants'] ?? [] as $variant) {
                if (empty($variant['size']) && empty($variant['color'])) {
                    continue;
                }

                $product->variants()->create([
                    'size' => $variant['size'] ?? null,
                    'color' => $variant['color'] ?? null,
                    'stock_quantity' => $variant['stock_quantity'] ?? 0,
                ]);
            }

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $path = $file->store('products', 'public');
                    $product->images()->create(['image' => $path]);
                }
            }

            return $product;
        });

        return redirect()
            ->route('admin.products.index')
            ->with('success', "Product \"{$product->name}\" created successfully.");
    }

    public function edit($id)
    {
        $product = Product::with(['category', 'images', 'variants'])->findOrFail($id);
        $categories = Category::all();

        return inertia('Admin/Product/EditProduct', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $request, $product) {
            // 1. Update core fields, regenerating the slug only if the name changed
            $slug = $product->name !== $validated['name']
                ? Product::generateUniqueSlug($validated['name'], $product->id)
                : $product->slug;

            $product->update([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'slug' => $slug,
                'price' => $validated['price'],
                'discount_amount' => $validated['discount_amount'] ?? 0,
                'stock_quantity' => $validated['stock_quantity'] ?? 0,
                'sku' => $validated['sku'],
                'description' => $validated['description'],
                'featured' => $validated['featured'] ?? false,
                'status' => $validated['status'],
            ]);

            // 2. Remove any images the user deleted in the UI
            if (!empty($validated['deleted_image_ids'])) {
                $images = ProductImage::where('product_id', $product->id)
                    ->whereIn('id', $validated['deleted_image_ids'])
                    ->get();

                foreach ($images as $image) {
                    Storage::disk('public')->delete($image->image);
                    $image->delete();
                }
            }

            // 3. Add newly uploaded images
            if ($request->hasFile('new_images')) {
                foreach ($request->file('new_images') as $file) {
                    $path = $file->store('products', 'public');
                    $product->images()->create(['image' => $path]);
                }
            }

            // 4. Replace variants wholesale — simplest correct approach for a form
            //    that just submits "the current full list" rather than diffing edits.
            $product->variants()->delete();

            foreach ($validated['variants'] ?? [] as $variant) {
                if (empty($variant['size']) && empty($variant['color'])) {
                    continue;
                }

                $product->variants()->create([
                    'size' => $variant['size'] ?? null,
                    'color' => $variant['color'] ?? null,
                    'stock_quantity' => $variant['stock_quantity'] ?? 0,
                ]);
            }
        });

        return redirect()
            ->route('admin.products.index')
            ->with('success', "Product \"{$product->name}\" updated successfully.");
    }

}
