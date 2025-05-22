<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolUpdate extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'image_url', 'type',  'status', 'revision_fields', 'revision_remarks', 'created_by', 'approved_by', 'rejected_at', 'published_at', 'archived_at', 'facebook_post_id', 'post_to_facebook', 'is_notified', 'is_urgent'];

    protected $casts = [
        'revision_fields' => 'array', 
        'rejected_at' => 'datetime', 
        'published_at' => 'datetime',
        'archived_at' => 'datetime',
        'post_to_facebook' => 'boolean',
    ];
    

    const TYPE_ANNOUNCEMENT = 'announcement';
    const TYPE_EVENT = 'event';
    const STATUS_DRAFT = 'draft';
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_REVISION = 'revision';
    const STATUS_PUBLISHED = 'published';
    const STATUS_ARCHIVED = 'archived';

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
