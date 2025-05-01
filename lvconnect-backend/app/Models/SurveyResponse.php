<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SurveyResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_information_id',
        'survey_id',
        'submitted_at',
    ];

    protected $dates = [
        'submitted_at',
    ];

    // Relationships

    public function student()
    {
        return $this->belongsTo(StudentInformation::class, 'student_information_id');
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
