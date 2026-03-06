<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalSetting extends Model {

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    protected $fillable = [
        'user_id',
        'carb_ratio',
        'correction_start',
        'correction_step',
        'correction_units',
        'sensitivity_factor',
    ];

    use HasFactory;

}
