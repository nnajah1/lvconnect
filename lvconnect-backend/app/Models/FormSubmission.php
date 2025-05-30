<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_type_id',
        'submitted_by',
        'status',
        'submitted_at',
        'admin_remarks',
        'reviewed_by',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];
    protected $appends = ['submitted_by_name', 'form_type_title', 'reviewed_by_name'];

    /**
     * Belongs to a form type.
     */
    public function formType()
    {
        return $this->belongsTo(FormType::class);
    }

    public function getFormTypeTitleAttribute()
    {
        return $this->formType?->title;
    }

    /**
     * Belongs to a student user.
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function getSubmittedByNameAttribute()
    {
        return trim("{$this->student?->first_name} {$this->student?->last_name}");
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
    public function getReviewedByNameAttribute()
    {
        return $this->reviewer
            ? trim("{$this->reviewer->first_name} {$this->reviewer->last_name}")
            : null;
    }


    /**
     * Has many answers/data entries.
     */
    public function submissionData()
    {
        return $this->hasMany(FormSubmissionData::class);
    }
}
