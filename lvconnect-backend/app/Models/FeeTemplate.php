<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'is_visible',
        'first_term_total',
        'second_term_total',
        'whole_academic_year',
        'scholarship_discount',
        'total_payment',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'first_term_total' => 'string',
        'second_term_total' => 'string',
        'whole_academic_year' => 'string',
        'scholarship_discount' => 'string',
        'total_payment' => 'string',
    ];

    /**
     * Get the fees associated with this template.
     */
    public function fees()
    {
        return $this->hasMany(Fee::class);
    }
}
