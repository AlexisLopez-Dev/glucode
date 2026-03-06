<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GlucosePoint extends Model {

    public function simulation(): BelongsTo {
        return $this->belongsTo(Simulation::class);
    }

    protected $fillable = [
        'simulation_id',
        'minute',
        'glucose_value',
    ];

    use HasFactory;

}
