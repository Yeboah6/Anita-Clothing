<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{

    public function cart()
    {
        return inertia('Cart');
    }

    public function getItems()
    {
        $userId = Auth::id();
        
        $cartItems = Cart::with(['product' => function($query) {
            $query->select('id', 'category_id', 'name', 'slug', 'price', 'discount_amount', 'status')
                  ->with(['images' => function($q) {
                      $q->select('id', 'product_id', 'image_url', 'is_primary')
                        ->orderBy('is_primary', 'desc')
                        ->orderBy('id', 'asc')
                        ->limit(1);
                  }]);
        }])
        ->where('user_id', $userId)
        ->get();

        return response()->json([
            'cart_items' => $cartItems,
            'count' => $cartItems->sum('quantity'),
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