<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'order_id',
        'product_id',
        'rating',
        'title',
        'review',
        'is_approved',
        'is_verified_purchase',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_approved' => 'boolean',
        'is_verified_purchase' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

        /**
     * Get the average rating for a product.
     */
    public static function getAverageRating(int $productId): float
    {
        return static::where('product_id', $productId)
            ->approved()
            ->avg('rating') ?? 0;
    }

    /**
     * Get rating distribution for a specific product or all products.
     *
     * @param int|null $productId
     * @return array
     */
    public static function getRatingDistribution(?int $productId = null): array
    {
        $query = static::approved();
        
        if ($productId) {
            $query->where('product_id', $productId);
        }
        
        $distribution = [];
        for ($i = 5; $i >= 1; $i--) {
            $distribution[$i] = (clone $query)->where('rating', $i)->count();
        }
        return $distribution;
    }

    public function scopeWithRating($query, int $rating)
    {
        return $query->where('rating', $rating);
    }

    
    /**
     * Get overall platform statistics.
     */
    public static function getPlatformStats(): array
    {
        return [
            'average_rating' => round(static::approved()->avg('rating') ?? 0, 1),
            'total_reviews' => static::approved()->count(),
            'rating_distribution' => static::getRatingDistribution(),
        ];
    }
}
