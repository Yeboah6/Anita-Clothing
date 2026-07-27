<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlistItems = Wishlist::with('product.images')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return inertia('Customer/AccountWishlist', [
            'wishlistItems' => $wishlistItems,
            'user' => auth()->user()->only(['id', 'name', 'email', 'role']),
        ]);
    }
}
