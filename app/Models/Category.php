<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Product;

class Category extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'category_id',
        'slug',
        'name',
    ];

    public function product()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
