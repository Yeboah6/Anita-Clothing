<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\OrderItem;
use App\Models\Payment;

class Order extends Model
{
    protected $fillable = [
        'user_id',
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
        'note',
        'subtotal',
        'shipping',
        'tax',
        'order_status',
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

    public function getFormattedTotalAttribute(): string
    {
        return '$' . number_format($this->total_amount, 2);
    }
}
