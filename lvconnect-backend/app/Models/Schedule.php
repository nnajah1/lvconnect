<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'course_id',
        'semester',
        'academic_year',
        'year_level',
        'day',
        'start_time',
        'end_time',
        'room',
        'instructor',
        'course_name',
        'course_code',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    /**
     * Get the course associated with the schedule.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

      public function enrollmentSchedule() {
        return $this->belongsTo(EnrollmentSchedule::class);
    }
}
