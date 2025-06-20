<?php

namespace App\Models;

use App\Models\Report;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comments extends Model
{
    use HasFactory;
    protected $fillable = [
        'report_id',
        'user_id',
        'comment_text',
    ];
    
    public function report()
    {
        return $this->belongsTo(Report::class);
    }
}
