<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyQuestion extends Model
{
    protected $fillable = ['survey_id', 'survey_question_type', 'question', 'description', 'survey_question_data', 'order', 'is_required'];
    protected $casts = [
        'field_data' => 'array',
    ];
    
    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function answers()
    {
        return $this->hasMany(SurveyAnswer::class);
    }
}
