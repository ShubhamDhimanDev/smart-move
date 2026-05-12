<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseApplication extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'dob',
        'phone',
        'email',
        'nationality_immigration_status',
        'preferred_course_location',
        'has_taken_sfe_before',
        'previous_qualification_work_experience',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'dob' => 'date',
            'has_taken_sfe_before' => 'boolean',
        ];
    }
}
