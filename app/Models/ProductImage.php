<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Product;

class ProductImage extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $table = 'product_images';
    protected $fillable = [
        'product_image_id',
        'product_id',
        'image'
    ];

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
