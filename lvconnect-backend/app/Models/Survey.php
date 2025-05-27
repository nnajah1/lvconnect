<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $fillable = ['title', 'description', 'created_by', 'visibility_mode'];

    public function questions()
    {
        return $this->hasMany(SurveyQuestion::class);
    }

    public function students()
    {
        return $this->belongsToMany(StudentInformation::class,'survey_student', 'survey_id', 'student_information_id')
                    ->withPivot('completed_at')
                    ->withTimestamps();
    }

}
