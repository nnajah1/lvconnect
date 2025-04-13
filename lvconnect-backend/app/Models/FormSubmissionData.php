<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormSubmissionData extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_submission_id',
        'form_field_id',
        'field_name',
        'answer_data',
        'is_verified',
    ];

    protected $casts = [
        'answer_data' => 'array',
        'is_verified' => 'boolean',
    ];

    /**
     * Belongs to a submission.
     */
    public function formSubmission()
    {
        return $this->belongsTo(FormSubmission::class);
    }

    /**
     * Belongs to a specific form field.
     */
    public function formField()
    {
        return $this->belongsTo(FormField::class);
    }
}
