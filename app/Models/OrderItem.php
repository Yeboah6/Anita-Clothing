<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Product;
use App\Models\Order;

class OrderItem extends Model
{
    protected $fillable = [
        'order_item_id',
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
