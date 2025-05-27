<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentFamilyInformation extends Model
{
    protected $fillable = [
        'student_information_id',
        'num_children_in_family', 
        'birth_order', 
        'has_sibling_in_lvcc', 
        'mother_first_name', 
        'mother_middle_name', 
        'mother_last_name',
        'mother_religion', 
        'mother_occupation', 
        'mother_monthly_income', 
        'mother_mobile_number', 
        'father_first_name', 
        'father_middle_name', 
        'father_last_name', 
        'father_religion', 
        'father_occupation', 
        'father_monthly_income',
        'father_mobile_number', 
        'guardian_first_name', 
        'guardian_middle_name', 
        'guardian_last_name', 
        'guardian_religion', 
        'guardian_occupation', 
        'guardian_monthly_income', 
        'guardian_mobile_number', 
        'guardian_relationship',
        'created_at', 
        'updated_at'
    ];
    protected $casts = [
    'has_sibling_in_lvcc' => 'boolean',
];
    public function studentInfo() {
        return $this->belongsTo(StudentInformation::class, 'student_information_id');
    }
}
