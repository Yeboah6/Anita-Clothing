<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Order;

class Payment extends Model
{
    // protected $table = 'payments';

    protected $fillable = [
        'payment_id',
        'order_id',
        'payment_reference',
        'payment_method',
        'amount',
        'status'
    ];

    public function order() {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
