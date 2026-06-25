<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\OrderController;

use App\Http\Controllers\Account\ProfileController;
use App\Http\Controllers\Account\WishlistController;
use App\Http\Controllers\Account\OrderController;
use App\Http\Controllers\Account\AddressController;


Route::get('/', function () {
    return inertia('Home');
});

Route::get('/collections', function () {
    return inertia('Collections');
});

Route::get('/new-arrivals', function () {
    return inertia('NewArrivalsPage');
});

Route::get('/about', function () {
    return inertia('About');
});

Route::get('/category/accessories', function () {
    return inertia('Category');
});

Route::get('/checkout', function () {
    return inertia('Checkout');
});

// Auth Routes
Route::get('/register', [AuthController::class, 'Register']);
Route::get('/login', [AuthController::class, 'Login']);
Route::get('/forgot-password', [AuthController::class, 'ForgotPassword']);


// Admin Routes
Route::get('/admin', [DashboardController::class, 'Index']);
Route::get('/admin/products', [ProductController::class, 'Index']);
Route::get('/admin/orders', [OrderController::class, 'Index']);
Route::get('/admin/customers', [CustomerController::class, 'Index']);


// Customer & Account Routes
Route::get('/account/profile', [AccountController::class, 'Index']);
Route::get('/account/orders', [OrderController::class, 'Index']);
Route::get('/account/wishlist', [WishlistController::class, 'Index']);
Route::get('/account/addresses', [AddressController::class, 'Index']);