<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\{Storage, DB};
use Inertia\Inertia;
use Illuminate\Support\Str;
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

        DB::transaction(function () use ($request, $product, $validated) {

            // Regenerate slug only if the name changed, excluding this product
            $slug = $product->slug;
            if ($product->name !== $validated['name']) {
                $slug = Str::slug($validated['name']);
                $originalSlug = $slug;
                $count = 1;
                while (
                    Product::where('slug', $slug)
                        ->where('id', '!=', $product->id)
                        ->exists()
                ) {
                    $slug = "{$originalSlug}-{$count}";
                    $count++;
                }
            }

            $product->update([
                'name'             => $validated['name'],
                'slug'             => $slug,
                'category_id'      => $validated['category_id'],
                'price'            => $validated['price'],
                'discount_amount'  => $validated['discount_amount'] ?? 0,
                'stock_quantity'   => $validated['stock_quantity'] ?? 0,
                'sku'              => $validated['sku'],
                'description'      => $validated['description'],
                'featured'         => $validated['featured'] ?? false,
                'status'           => $validated['status'],
            ]);

            // ── Deleted existing images ──────────────────────────────
            if (!empty($validated['deleted_image_ids'])) {
                $imagesToDelete = ProductImage::whereIn('id', $validated['deleted_image_ids'])
                    ->where('product_id', $product->id)
                    ->get();

                foreach ($imagesToDelete as $image) {
                    Storage::disk('public')->delete($image->image);
                    $image->delete();
                }
            }

            // ── New images ────────────────────────────────────────────
            if ($request->hasFile('new_images')) {
                foreach ($request->file('new_images') as $file) {
                    $path = $file->store('products', 'public');

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image'      => $path,
                    ]);
                }
            }

            // ── Variants: update existing, create new, delete removed ──
            $submittedVariants = collect($validated['variants'] ?? []);
            $submittedIds = $submittedVariants->pluck('id')->filter()->values();

            // Delete variants that existed before but aren't in the submitted list
            $product->variants()
                ->whereNotIn('id', $submittedIds)
                ->delete();

            foreach ($submittedVariants as $variant) {
                if (!empty($variant['id'])) {
                    ProductVariant::where('id', $variant['id'])
                        ->where('product_id', $product->id)
                        ->update([
                            'size'           => $variant['size'] ?? null,
                            'color'          => $variant['color'] ?? null,
                            'stock_quantity' => $variant['stock_quantity'] ?? 0,
                        ]);
                } else {
                    $product->variants()->create([
                        'size'           => $variant['size'] ?? null,
                        'color'          => $variant['color'] ?? null,
                        'stock_quantity' => $variant['stock_quantity'] ?? 0,
                    ]);
                }
            }
        });

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function show($id)
    {
        $product = Product::with(['category', 'images', 'variants'])->findOrFail($id);
    
        return inertia('Admin/Product/ShowProduct', [
            'product' => $product
        ]);
    }

}
