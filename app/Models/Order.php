<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\OrderItem;
use App\Models\Payment;
use \App\Models\Product;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'address_id',
        'order_number',
        'total_amount',
        'email',
        'phone',
        'first_name',
        'last_name',
        'apartment',
        'address',
        'city',
        'state',
        'zip',
        'notes',
        'subtotal',
        'order_status',
        'payment_status',
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

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function getRouteKeyName()
    {
        return 'order_number';
    }

    public function getFormattedTotalAttribute(): string
    {
        return '₵' . number_format($this->total_amount, 2);
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
