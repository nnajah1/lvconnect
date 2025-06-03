<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $fillable = [
        'applicant_registration_id',
        'course_id',
        'term',
        'academic_year',
        'grade',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function studentInformation()
    {
        return $this->belongsTo(StudentInformation::class);
    }
}
