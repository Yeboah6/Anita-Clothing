<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Home');
});

Route::get('/collections', function () {
    return inertia('Collections');
});

Route::get('/new-arrivals', function () {
    return inertia('NewArrivalsPage');
});