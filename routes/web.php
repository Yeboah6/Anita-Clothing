<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\AdminPaymentController;

use App\Http\Controllers\Account\ProfileController;
use App\Http\Controllers\Account\WishlistController;
use App\Http\Controllers\Account\CustomerOrderController;
use App\Http\Controllers\Account\AddressController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PaymentController;


Route::get('/', [MainController::class, 'index'])->name('home');

Route::get('/collections', [MainController::class, 'collections'])->name('collections');

Route::get('/new-arrivals', [MainController::class, 'newArrivals'])->name('new-arrivals');

Route::get('/about', [MainController::class, 'about'])->name('about');

Route::get('/category/{slug}', [MainController::class, 'category'])->name('category');

Route::get('/product/{slug}', [MainController::class, 'product'])->name('product');

Route::get('/payment/callback', [PaymentController::class, 'callback'])->name('payment.callback');

// Webhook must be excluded from CSRF protection (see note below)
Route::post('/payment/webhook', [PaymentController::class, 'webhook'])->name('payment.webhook');

// Auth Routes
// Guest routes (only accessible when not logged in)
Route::middleware('guest')->group(function () {
    Route::get('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/register', [AuthController::class, 'store']);

    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'storeLogin']);
});

Route::get('/forgot-password', [AuthController::class, 'ForgotPassword']);

Route::middleware('auth')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

    Route::get('/cart', [CartController::class, 'cart'])->name('cart');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::get('/cart/items', [CartController::class, 'getItems'])->name('cart.items');
    Route::put('/cart/{product}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{productId}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::delete('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
    Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');

    Route::post('/wishlist', [MainController::class, 'store']);
    Route::delete('/wishlist/{productId}', [MainController::class, 'destroy']);

    Route::get('/checkout', [CartController::class, 'checkout'])->name('checkout');
    Route::post('/checkout', [CartController::class, 'processCheckout'])->name('checkout.process');

    Route::get('/checkout/{order}/pay', [PaymentController::class, 'checkout'])->name('checkout.pay');
    Route::post('/checkout/{order}/pay', [PaymentController::class, 'initialize'])->name('checkout.initialize');
    Route::get('/checkout/{order}/success', [PaymentController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/{order}/failed', [PaymentController::class, 'failed'])->name('checkout.failed');

    // Customer & Account Routes
    Route::middleware('role:customer')->group(function () {
        Route::get('/account/profile', [ProfileController::class, 'Index']);
        Route::put('/account/profile', [ProfileController::class, 'updateProfile'])->name('account.profile.update');
        Route::put('/account/password', [ProfileController::class, 'updatePassword'])->name('account.password.update');

        Route::get('/account/orders', [CustomerOrderController::class, 'Index']);
        Route::get('/account/wishlist', [WishlistController::class, 'Index']);

        Route::get('/account/addresses', [AddressController::class, 'Index']);
        Route::get('/account/addresses/add', [AddressController::class, 'create'])->name('account.addresses.add');
        Route::post('/account/addresses/add', [AddressController::class, 'store'])->name('account.addresses.store');
        Route::get('/account/addresses', [AddressController::class, 'index']);
        Route::get('/account/addresses/{address}/edit', [AddressController::class, 'edit']);
        Route::delete('/account/addresses/{address}', [AddressController::class, 'destroy']);
        Route::put('/account/addresses/{address}', [AddressController::class, 'update']);

    });

    // Admin Routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin', [DashboardController::class, 'Index']);

        Route::get('/admin/products', [ProductController::class, 'Index'])->name('admin.products.index');
        Route::get('/admin/products/add', [ProductController::class, 'create'])->name('admin.products.add');
        Route::post('/admin/products/add', [ProductController::class, 'store'])->name('admin.products.store');
        Route::get('/admin/products/{id}', [ProductController::class, 'show'])->name('admin.products.show');
        Route::get('/admin/products/{id}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
        Route::put('/admin/products/{product}', [ProductController::class, 'update'])->name('admin.products.update');
        Route::delete('/admin/products/{id}', [ProductController::class, 'destroy'])->name('admin.products.destroy');

        Route::get('/admin/orders', [OrderController::class, 'Index']);
        Route::get('/admin/orders/{orderNumber}', [OrderController::class, 'show'])->name('admin.orders.show');
        Route::get('/admin/orders/{orderNumber}/edit', [OrderController::class, 'edit'])->name('admin.orders.edit');

        Route::get('/admin/customers', [CustomerController::class, 'Index']);
        Route::get('/admin/categories', [CategoryController::class, 'Index']);

        Route::get('/admin/payments', [AdminPaymentController::class, 'index'])->name('admin.payments.index');
        Route::get('/admin/payments/export', [AdminPaymentController::class, 'export'])->name('admin.payments.export');

        Route::get('/admin/categories/add', [CategoryController::class, 'create'])->name('admin.categories.add');
        Route::post('/admin/categories/add', [CategoryController::class, 'store'])->name('admin.categories.store');
    });

});



