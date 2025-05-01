<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyAnswer extends Model
{
    protected $fillable = ['student_information_id', 'survey_question_id', 'img_url', 'answer'];

    public function question()
    {
        return $this->belongsTo(SurveyQuestion::class);
    }

    public function surveyResponse()
    {
        return $this->belongsTo(SurveyResponse::class);
    }
}
