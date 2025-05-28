<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SurveyResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'survey_id',
        'student_information_id',
        'submitted_at',
    ];
    protected $dates = [
        'submitted_at',
    ];

    // Relationships

    public function student()
    {
        return $this->belongsTo(StudentInformation::class, 'student_information_id');
        // return $this->belongsTo(User::class, 'student_information_id');
    }

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function answers()
    {
        return $this->hasMany(SurveyAnswer::class);
    }
}
