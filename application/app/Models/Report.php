<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'image',
        'latitude',
        'longitude',
        'damage_type',
        'severity_score',
        'urgency_score',
        'status',
    ];
}
