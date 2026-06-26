<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\OrderItem;
use App\Models\Payment;

class Order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'order_id',
        'user_id',
        'order_number',
        'total_number',
        'payment_status',
        'order_status',
        'shipping_address'
    ];

    public function user() 
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'order_id');
    }
}
