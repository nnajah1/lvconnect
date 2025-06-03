<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnrollmentSchedule extends Model
{
    protected $fillable = [
        'academic_year_id', 'semester', 'is_active', 'start_date', 'end_date', 'created_at', 'updated_at'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'datetime',
        'end_date' => 'datetime'
    ];

    protected $appends = ['school_year'];

   
    public function getSchoolYearAttribute()
    {
        return $this->academicYear?->school_year;
    }

    public function academicYear() {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function enrollees() {
        return $this->hasMany(EnrolleeRecord::class);
    }
    

}
