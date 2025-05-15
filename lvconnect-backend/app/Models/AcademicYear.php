<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    protected $fillable = [
        'school_year', 'is_active', 'created_at', 'updated_at'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function enrollmentSchedule() {
        return $this->hasMany(EnrollmentSchedule::class);
    }
}
