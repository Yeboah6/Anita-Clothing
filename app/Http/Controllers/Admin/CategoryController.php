<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function create() {
        return inertia('Admin/Category/Index');
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
            'slug' => 'required|string|max:255|unique:categories,slug|regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
        ], [
            'name.unique' => 'A category with this name already exists.',
            'slug.unique' => 'This slug is already in use. Please choose another.',
            'slug.regex'  => 'Slug must contain only lowercase letters, numbers, and hyphens.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        $category = Category::create([
            'name' => $request->name,
            'slug' => $request->slug,
        ]);

        return redirect()->route('admin.categories.add')->with('message', 'Category created successfully.');

    }
}
