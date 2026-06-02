<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgentEnquiry extends Model
{
    protected $fillable = [
        'name',
        'company_name',
        'email',
        'mobile',
        'message',
    ];
}
