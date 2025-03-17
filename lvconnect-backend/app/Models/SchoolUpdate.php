<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolUpdate extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'image_url', 'type',  'status', 'revision_fields', 'revision_remarks', 'created_by', 'approved_by'];

    protected $casts = [
        'revision_fields' => 'array', // Automatically cast JSON to array
    ];
    

    const TYPE_ANNOUNCEMENT = 'announcement';
    const TYPE_EVENT = 'event';
    const STATUS_DRAFT = 'draft';
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_REVISION = 'revision';
    const STATUS_PUBLISHED = 'published';

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
