<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
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
}