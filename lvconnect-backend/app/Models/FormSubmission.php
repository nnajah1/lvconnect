<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_type_id',
        'student_id',
        'status',
        'submitted_at',
        'admin_remarks',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    /**
     * Belongs to a form type.
     */
    public function formType()
    {
        return $this->belongsTo(FormType::class);
    }

    /**
     * Belongs to a student user.
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Has many answers/data entries.
     */
    public function submissionData()
    {
        return $this->hasMany(FormSubmissionData::class);
    }
}
