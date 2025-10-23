<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VotingRoom extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'privacy',
        'start_time',
        'end_time',
    ];
}
