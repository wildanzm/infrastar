<?php

namespace App\Models;

use App\Models\Report;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'message',
        'is_read',
    ];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }
    
}
