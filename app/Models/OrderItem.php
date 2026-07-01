<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Product;
use App\Models\Order;

class OrderItem extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $table = 'order_items';
    protected $fillable = [
        // 'order_items_id',
        'order_id',
        'product_id',
        'quantity',
        'price'
    ];

    public function order() 
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
