<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'term',
        'status',
        'is_visible',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
    ];

    /**
     * Get the fees associated with this template.
     */
    public function fees()
    {
        return $this->hasMany(Fee::class);
    }
}
