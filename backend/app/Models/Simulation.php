<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Simulation extends Model {

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function glucosePoints(): HasMany {
        return $this->hasMany(GlucosePoint::class);
    }

    protected $fillable = [
        'user_id',
        'carbs_ingested',
        'insulin_administered',
        'initial_glucose',
        'ratio_snapshot',
        'factor_snapshot',
    ];

    use HasFactory;

}
