<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Product;

class ProductVariant extends Model
{
    // protected $table = 'product_variants';

    protected $fillable = [
        'product_variant_id',
        'product_id',
        'size',
        'color',
        'stock_quantity'
    ];
    
    public function product() 
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
