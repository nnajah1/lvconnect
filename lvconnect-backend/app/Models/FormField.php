<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormField extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_type_id',
        'field_data',
        'required',
        'page',
    ];

    protected $casts = [
        'field_data' => 'array',
        'required' => 'boolean',
    ];

    /**
     * Belongs to a form type.
     */
    public function formType()
    {
        return $this->belongsTo(FormType::class);
    }

    /**
     * The student answers related to this form field.
     */
    public function submissionData()
    {
        return $this->hasMany(FormSubmissionData::class);
    }
}
