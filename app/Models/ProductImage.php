<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

use App\Models\Product;

class ProductImage extends Model
{
    // protected $table = 'product_images';

    protected $fillable = [
        'product_id',
        'image'
    ];

    protected $appends = ['url'];

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->image);
    }
}
