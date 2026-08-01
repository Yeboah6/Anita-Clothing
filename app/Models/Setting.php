<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    const CACHE_KEY = 'app.settings';

    /**
     * Get a single setting value, falling back to $default if not set.
     */
    public static function get(string $key, $default = null)
    {
        return static::allCached()->get($key, $default);
    }

    /**
     * Set (create or update) a single setting.
     */
    public static function set(string $key, $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Set many settings at once — e.g. Setting::setMany($validated).
     */
    public static function setMany(array $pairs): void
    {
        foreach ($pairs as $key => $value) {
            static::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * All settings as a flat, cached key => value collection.
     *
     * Cached as a plain array, not a Collection/model object. Caching
     * objects is what causes "Return value must be of type X,
     * __PHP_Incomplete_Class returned" — PHP's unserialize() can fail to
     * fully reconstruct a class instance (stale cache entry from before a
     * refactor, a cache driver that doesn't round-trip objects cleanly,
     * etc). Arrays have no class to resolve, so this failure mode goes
     * away entirely rather than just being less likely.
     */
    public static function allCached(): \Illuminate\Support\Collection
    {
        $array = Cache::rememberForever(self::CACHE_KEY, function () {
            return static::query()->pluck('value', 'key')->toArray();
        });

        return collect($array);
    }
}