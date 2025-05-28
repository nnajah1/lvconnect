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
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];
    protected $appends = ['submitted_by_name', 'form_type_title'];

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

    /**
     * Has many answers/data entries.
     */
    public function submissionData()
    {
        return $this->hasMany(FormSubmissionData::class);
    }
}
