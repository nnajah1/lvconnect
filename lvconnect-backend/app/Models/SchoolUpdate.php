<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolUpdate extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'image_url', 'type', 'status', 'revision_fields', 'revision_remarks', 'created_by', 'approved_by', 'rejected_at', 'published_at', 'archived_at', 'facebook_post_id', 'is_notified', 'is_urgent', 'restored_at'];

    protected $casts = [
        'revision_fields' => 'array',
        'rejected_at' => 'datetime',
        'published_at' => 'datetime',
        'archived_at' => 'datetime',
        'synced_at' => 'datetime',
        'restored_at' => 'datetime',
        'approved_at' => 'datetime',
        'image_url' => 'array',
    ];

    const TYPE_ANNOUNCEMENT = 'announcement';
    const TYPE_EVENT = 'event';
    const STATUS_DRAFT = 'draft';
    const STATUS_PENDING = 'pending';
    const STATUS_PUBLISHED = 'published';
    const STATUS_ARCHIVED = 'archived';

    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_REVISION = 'revision';
    const STATUS_SYNCED = 'published & synced';

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    protected $appends = ['image_urls'];

   public function getImageUrlsAttribute()
{
    return array_map('generateSignedUrl', $this->image_url ?? []);
}


}
