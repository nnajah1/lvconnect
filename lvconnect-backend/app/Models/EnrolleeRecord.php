<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnrolleeRecord extends Model
{
    protected $fillable = [
        'student_information_id', 'program_id', 'enrollment_schedule_id', 'year_level', 'privacy_policy', 'enrollment_status', 'admin_remarks', 'submission_date', 'created_at', 'updated_at'
    ];

    protected $casts = [
        'privacy_policy' => 'boolean',
        'submission_date' => 'date',
    ];

    public function studentInfo() {
        return $this->belongsTo(StudentInformation::class, 'student_information_id');
    }

    public function program() {
        return $this->belongsTo(Program::class, 'program_id');
    }
    
    public function enrollmentSchedule() {
        return $this->belongsTo(EnrollmentSchedule::class, 'enrollment_schedule_id');
    }
    

}
