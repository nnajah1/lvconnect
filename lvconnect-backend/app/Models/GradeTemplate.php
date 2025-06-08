<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeTemplate extends Model
{
    protected $fillable = [
        'student_information_id',
        'term',
        'school_year',
        'target_GWA',
        'actual_GWA',
    ];

    public function studentInformation()
    {
        return $this->belongsTo(StudentInformation::class);
    }
}
