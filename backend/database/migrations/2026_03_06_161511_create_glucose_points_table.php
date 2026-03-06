<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('glucose_points', function (Blueprint $table) {
            $table->id();

            $table->foreignId('simulation_id')->constrained()->cascadeOnDelete();

            $table->integer('minute');
            $table->integer('glucose_value');

            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('glucose_points');
    }
};
