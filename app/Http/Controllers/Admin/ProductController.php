<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function Index() {
        return inertia('Admin/AdminProducts');
    }

    public function create() {
        return inertia('Admin/Product/AddProduct');
    }
}
