<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Simulation extends Model {

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
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
