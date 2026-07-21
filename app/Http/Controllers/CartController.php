<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Order;
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

        // dd($itemData);
        
        return Inertia::render('Cart', [
            'serverCart' => [
                'items' => $items,
                'count' => $count,
                'total' => round($total, 2),
            ]
        ]);
    }

    public function checkout()
    {
        $user = Auth::user();
        $items = [];
        $count = 0;
        $subtotal = 0;
    
        $userInfo = null;
        
        if ($user) {
            $nameParts = explode(' ', $user->name, 2);
            $firstName = $nameParts[0] ?? '';
            $lastName = $nameParts[1] ?? '';
    
             $userInfo = [
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $user->email ?? '',
                'phone' => $user->phone ?? $user->mobile ?? $user->contact_number ?? '',
            ];
    
            // Get cart items with product details
            $cartItems = Cart::where('user_id', $user->id)
                ->with('product')
                ->get();
            
            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;
                if (!$product) continue;
                
                $basePrice = floatval($product->price ?? 0);
                $discountAmount = floatval($product->discount_amount ?? 0);
                $finalPrice = $discountAmount > 0 ? $basePrice - $discountAmount : $basePrice;
                
                // Get first image
                $imageUrl = null;
                if (method_exists($product, 'images')) {
                    $firstImage = $product->images()->first();
                    if ($firstImage) {
                        $imageUrl = $firstImage->image_url 
                            ?? $firstImage->url 
                            ?? $firstImage->path 
                            ?? $firstImage->filename 
                            ?? $firstImage->src 
                            ?? null;
                        
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
                $subtotal += $finalPrice * $cartItem->quantity;
            }
        }
        
        return Inertia::render('Checkout', [
            'serverCart' => [
                'items' => $items,
                'count' => $count,
                'total' => round($subtotal, 2),
            ],
            'userInfo' => $userInfo,
        ]);
    }

public function processCheckout(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email',
        'phone' => 'nullable|string',
        'firstName' => 'required|string|max:255',
        'lastName' => 'required|string|max:255',
        'address' => 'required|string|max:255',
        'apartment' => 'nullable|string|max:255',
        'city' => 'required|string|max:255',
        'state' => 'required|string|max:255',
        'zip' => 'required|string|max:20',
        'notes' => 'nullable|string',
        'items' => 'required|array',
        'items.*.product_id' => 'required|exists:products,id',
        'items.*.size' => 'nullable|string',
        'items.*.color' => 'nullable|string',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.price' => 'required|numeric|min:0',
    ]);
    
    $user = Auth::user();
    $subtotal = 0;
    
    // Calculate subtotal and verify prices
    foreach ($validated['items'] as $item) {
        $product = Product::find($item['product_id']);
        if (!$product) {
            return back()->withErrors(['items' => 'One or more products are no longer available.']);
        }
        
        // Verify price hasn't changed
        $currentPrice = floatval($product->price ?? 0);
        $discountAmount = floatval($product->discount_amount ?? 0);
        $finalPrice = $discountAmount > 0 ? $currentPrice - $discountAmount : $currentPrice;
        
        if (abs($finalPrice - $item['price']) > 0.01) {
            return back()->withErrors(['items' => 'Prices have changed. Please review your cart.']);
        }
        
        $subtotal += $finalPrice * $item['quantity'];
    }
    
    // Calculate shipping and tax
    // $shipping = $subtotal > 100 ? 0 : 9.99;
    // $tax = round($subtotal * 0.08, 2);
    $total = $subtotal;
    
    // Create order
    $order = Order::create([
        'user_id' => $user ? $user->id : null,
        'email' => $validated['email'],
        'phone' => $validated['phone'] ?? null,
        'first_name' => $validated['firstName'],
        'last_name' => $validated['lastName'],
        'address' => $validated['address'],
        'apartment' => $validated['apartment'] ?? null,
        'city' => $validated['city'],
        'state' => $validated['state'],
        'zip' => $validated['zip'],
        'notes' => $validated['notes'] ?? null,
        'subtotal' => $subtotal,
        // 'shipping' => $shipping,
        // 'tax' => $tax,
        'total_amount' => $total,
        'status' => 'pending',
        'order_number' => 'ORD-' . strtoupper(uniqid()),
    ]);
    
    // Create order items
    foreach ($validated['items'] as $item) {
        $order->items()->create([
            'product_id' => $item['product_id'],
            // 'name' => Product::find($item['product_id'])->name ?? 'Product',
            'price' => $item['price'],
            'quantity' => $item['quantity'],
            'size' => $item['size'] ?? null,
            'color' => $item['color'] ?? null,
        ]);
    }
    
    // Clear cart after successful order
    if ($user) {
        Cart::where('user_id', $user->id)->delete();
    }
    
    // You might want to send confirmation email here
    // Mail::to($validated['email'])->send(new OrderConfirmation($order));
    
    return response()->json([
        'success' => true,
        'message' => 'Order placed successfully!',
        'order_id' => $order->id,
        'order_number' => $order->order_number,
        'redirect' => route('checkout.pay', ['order' => $order->id]),
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

    public function update(Request $request, $productId)
    {
        $validated = $request->validate([
            'size'     => ['nullable', 'string', 'max:20'],
            'color'    => ['nullable', 'string', 'max:50'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cartItem = Cart::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->where('size', $validated['size'] ?? null)
            ->where('color', $validated['color'] ?? null)
            ->firstOrFail();

        $cartItem->update(['quantity' => $validated['quantity']]);

        return response()->json(['message' => 'Cart updated.']);
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