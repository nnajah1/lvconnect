<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $fillable = ['title', 'description', 'created_by', 'is_visible', 'mandatory'];

    public function questions()
    {
        return $this->hasMany(SurveyQuestion::class);
    }

}
