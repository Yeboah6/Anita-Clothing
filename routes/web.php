<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\CategoryController;

use App\Http\Controllers\Account\ProfileController;
use App\Http\Controllers\Account\WishlistController;
use App\Http\Controllers\Account\CustomerOrderController;
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

    // Customer & Account Routes
    Route::middleware('role:customer')->group(function () {
        Route::get('/account/profile', [ProfileController::class, 'Index']);
        Route::get('/account/orders', [CustomerOrderController::class, 'Index']);
        Route::get('/account/wishlist', [WishlistController::class, 'Index']);
        Route::get('/account/addresses', [AddressController::class, 'Index']);
    });

    // Admin Routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin', [DashboardController::class, 'Index']);

        Route::get('/admin/products', [ProductController::class, 'Index'])->name('admin.products.index');
        Route::get('/admin/products/add', [ProductController::class, 'create'])->name('admin.products.add');
        Route::post('/admin/products/add', [ProductController::class, 'store'])->name('admin.products.store');
        Route::get('/admin/products/{id}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
        Route::put('/admin/products/{id}', [ProductController::class, 'update'])->name('admin.products.update');
        Route::delete('/admin/products/{id}', [ProductController::class, 'destroy'])->name('admin.products.destroy');

        Route::get('/admin/orders', [OrderController::class, 'Index']);
        Route::get('/admin/customers', [CustomerController::class, 'Index']);
        Route::get('/admin/categories', [CategoryController::class, 'Index']);

        Route::get('/admin/categories/add', [CategoryController::class, 'create'])->name('admin.categories.add');
        Route::post('/admin/categories/add', [CategoryController::class, 'store'])->name('admin.categories.store');
    });

});



