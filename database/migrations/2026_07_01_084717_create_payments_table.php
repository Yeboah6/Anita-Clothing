<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');

            $table->string('reference')->unique(); // Paystack transaction reference
            $table->decimal('amount', 10, 2);       // amount in Naira/major unit
            $table->string('currency', 10)->default('GHS');

            $table->string('provider')->default('paystack');
            $table->enum('status', ['pending', 'success', 'failed', 'abandoned'])
                  ->default('pending');

            $table->string('channel')->nullable();      // card, bank, ussd, etc.
            $table->string('paystack_access_code')->nullable();
            $table->json('gateway_response')->nullable(); // raw verify payload, for auditing

            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
    */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
