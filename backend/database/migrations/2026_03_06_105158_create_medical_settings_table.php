<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('medical_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();

            $table->decimal('carb_ratio', 8, 2);
            $table->integer('correction_start');
            $table->integer('correction_step');
            $table->decimal('correction_units', 8, 2);

            $table->decimal('sensitivity_factor', 8, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_settings');
    }
};
