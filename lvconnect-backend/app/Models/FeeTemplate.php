<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id',
        'is_visible',
        'tuition_per_unit',
        'total_units',
        'tuition_total',
        'miscellaneous_total',
        'first_term_total',
        'second_term_total',
        'whole_academic_year',
        'scholarship_discount',
        'total_payment',
    ];

    // protected $casts = [
    //     'is_visible' => 'boolean',
    //     'first_term_total' => 'string',
    //     'second_term_total' => 'string',
    //     'whole_academic_year' => 'string',
    //     'scholarship_discount' => 'string',
    //     'total_payment' => 'string',
    // ];

    protected $casts = [
        'tuition_per_unit' => 'float',
        'total_units' => 'integer',
        'first_term_total' => 'float',
        'second_term_total' => 'float',
        'whole_academic_year' => 'float',
        'total_payment' => 'float',
        'scholarship_discount' => 'float',
    ];

    protected $appends = ['school_year'];


    public function getSchoolYearAttribute()
    {
        return $this->academicYear?->school_year;
    }
    /**
     * Get the fees associated with this template.
     */
    public function fees()
    {
        return $this->hasMany(Fee::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
