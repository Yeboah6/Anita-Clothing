<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->unsignedTinyInteger('rating')->comment('1-5 star rating');
            $table->text('review');
            $table->boolean('is_approved')->default(true);
            $table->boolean('is_verified_purchase')->default(true);
            $table->timestamps();
            $table->softDeletes();

            // Prevent duplicate reviews for same product in same order
            $table->unique(['user_id', 'order_id', 'product_id']);
            
            // Indexes for better performance
            $table->index(['product_id', 'is_approved']);
            $table->index(['user_id', 'created_at']);
            $table->index('rating');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};