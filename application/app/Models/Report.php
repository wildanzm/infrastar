<?php

namespace App\Models;

use App\Models\Comments;
use App\Models\Notification;
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function comments()
    {
        return $this->hasMany(Comments::class);
    }
}
