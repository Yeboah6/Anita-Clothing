<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{

    public function cart()
    {
        $items = [];
        $count = 0;
        $total = 0;
        
        if (Auth::check()) {
            $userId = Auth::id();
            
            // Get cart items with product
            $cartItems = Cart::where('user_id', $userId)
                ->with('product')
                ->get();
            
            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;
                if (!$product) continue;
                
                $basePrice = floatval($product->price ?? 0);
                $discountAmount = floatval($product->discount_amount ?? 0);
                $finalPrice = $discountAmount > 0 ? $basePrice - $discountAmount : $basePrice;
                
                // Get first image - try different approaches
                $imageUrl = null;
                
                // Try to get image from relationship
                if (method_exists($product, 'images')) {
                    $firstImage = $product->images()->first();
                    if ($firstImage) {
                        // Try different possible column names
                        $imageUrl = $firstImage->image_url 
                            ?? $firstImage->url 
                            ?? $firstImage->path 
                            ?? $firstImage->filename 
                            ?? $firstImage->src 
                            ?? null;
                        
                        // If it's just a filename, prepend the storage path
                        if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL) && !str_starts_with($imageUrl, '/')) {
                            $imageUrl = '/storage/' . $imageUrl;
                        }
                    }
                }
                
                $itemData = [
                    'id' => $cartItem->id,
                    'product_id' => $cartItem->product_id,
                    'name' => $product->name ?? 'Product',
                    'slug' => $product->slug ?? null,
                    'price' => $finalPrice,
                    'original_price' => $basePrice,
                    'discount_amount' => $discountAmount,
                    'image' => $imageUrl,
                    'size' => $cartItem->size,
                    'color' => $cartItem->color,
                    'quantity' => $cartItem->quantity,
                ];
                
                $items[] = $itemData;
                $count += $cartItem->quantity;
                $total += $finalPrice * $cartItem->quantity;
            }
        }
        
        return Inertia::render('Cart', [
            'serverCart' => [
                'items' => $items,
                'count' => $count,
                'total' => round($total, 2),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'size'       => ['nullable', 'string', 'max:20'],
            'color'      => ['nullable', 'string', 'max:50'],
            'quantity'   => ['required', 'integer', 'min:1'],
        ]);

        $userId = Auth::id();

        $cartItem = Cart::where('user_id', $userId)
            ->where('product_id', $validated['product_id'])
            ->where('size', $validated['size'] ?? null)
            ->where('color', $validated['color'] ?? null)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $validated['quantity']);
        } else {
            Cart::create([
                'user_id'    => $userId,
                'product_id' => $validated['product_id'],
                'size'       => $validated['size'] ?? null,
                'color'      => $validated['color'] ?? null,
                'quantity'   => $validated['quantity'],
            ]);
        }

        return response()->json(['message' => 'Added to cart.']);
    }

    public function destroy(Request $request, $productId)
    {
        $validated = $request->validate([
            'size'  => ['nullable', 'string', 'max:20'],
            'color' => ['nullable', 'string', 'max:50'],
        ]);

        $userId = Auth::id();

        Cart::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('size', $validated['size'] ?? null)
            ->where('color', $validated['color'] ?? null)
            ->delete();

        return response()->json(['message' => 'Item removed.']);
    }

    public function clear()
    {
        $userId = Auth::id();
        Cart::where('user_id', $userId)->delete();

        return response()->json(['message' => 'Cart cleared.']);
    }

    /**
     * Get cart count for the authenticated user.
     */
    public function count()
    {
        $userId = Auth::id();
        $count = Cart::where('user_id', $userId)->sum('quantity');

        return response()->json(['count' => $count]);
    }
}