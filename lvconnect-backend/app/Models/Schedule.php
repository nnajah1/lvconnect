<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'program',
        'course_id',
        'term',
        'year_level',
        'student_type',
        'section',
        'day',
        'start_time',
        'end_time',
        'room',
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
