<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormType extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'pdf_path',
        'has_pdf',
        'created_by',
        'is_visible',
    ];

    /**
     * The user (admin) who created the form.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * The fields associated with this form.
     */
    public function formFields()
    {
        return $this->hasMany(FormField::class);
    }

    /**
     * Submissions of this form.
     */
    public function submissions()
    {
        return $this->hasMany(FormSubmission::class);
    }
}
