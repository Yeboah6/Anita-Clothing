<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'order_id',
        'order_item_id',
        'product_id',
        'rating',
        'review',
        'status',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class, 'order_item_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}