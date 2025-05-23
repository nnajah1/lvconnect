<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentInformation extends Model
{
    protected $fillable = [
        'user_id',
        'student_id_number',
        'first_name',
        'middle_name',
        'last_name',
        'civil_status',
        'gender',
        'birth_date',
        'birth_place',
        'mobile_number',
        'religion',
        'lrn',
        'fb_link',
        'student_type',
        'government_subsidy',
        'scholarship_status',
        'last_school_attended',
        'previous_school_address',
        'school_type',
        'academic_awards',
        'floor/unit/building_no',
        'house_no/street',
        'barangay',
        'city_municipality',
        'province',
        'zip_code',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];
    protected $appends = ['full_name', 'program_name'];

    public function getFullNameAttribute()
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
    public function getProgramNameAttribute()
    {
        return $this->enrolleeRecord
        ->first()?->program?->program_name;
    }

    public function studentFamilyInfo()
    {
        return $this->hasOne(StudentFamilyInformation::class);
    }

    public function enrolleeRecord()
    {
        return $this->hasMany(EnrolleeRecord::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
