<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyAnswer extends Model
{
    public $timestamps = false;
    protected $fillable = ['survey_response_id', 'survey_question_id','answer', 'img_url', 'taken_at','created_at'];

    protected $dates = ['taken_at', 'created_at'];

    public function question()
    {
        return $this->belongsTo(SurveyQuestion::class, 'survey_question_id');
    }

    public function surveyResponse()
    {
        return $this->belongsTo(SurveyResponse::class);
    }
}
