<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait IdGenerator
{
    /**
     * Generate a public-facing ID with prefix.
     *
     * @param string $prefix
     * @param int $length
     * @return string
     */
    public static function generate(string $prefix, int $length = 6): string
    {
        return strtoupper($prefix . '-' . Str::random($length));
    }

    /**
     * Generate a unique ID with database collision check.
     *
     * @param string $prefix
     * @param string $modelClass
     * @param string $column
     * @param int $length
     * @param int $maxAttempts
     * @return string
     */
    public static function generateUnique(
        string $prefix,
        string $modelClass,
        string $column = 'id',
        int $length = 6,
        int $maxAttempts = 10
    ): string {
        $attempts = 0;
        
        do {
            $id = self::generate($prefix, $length);
            $exists = $modelClass::where($column, $id)->exists();
            $attempts++;
        } while ($exists && $attempts < $maxAttempts);
        
        if ($exists) {
            throw new \RuntimeException(
                "Unable to generate unique ID after {$maxAttempts} attempts"
            );
        }
        
        return $id;
    }

    // Specific generators for each model
    public static function userId(): string
    {
        return self::generate('AD');
    }

    public static function productId(): string
    {
        return self::generate('PRD');
    }

    public static function orderId(): string
    {
        return self::generate('ORD');
    }

    public static function orderItemId(): string
    {
        return self::generate('ORI');
    }

    public static function productImageId(): string
    {
        return self::generate('IMG');
    }

    public static function productVariantId(): string
    {
        return self::generate('VAR');
    }

    public static function categoryId(): string
    {
        return self::generate('CAT');
    }

    public static function cartId(): string
    {
        return self::generate('CRT');
    }

    public static function paymentId(): string
    {
        return self::generate('PAY');
    }
}