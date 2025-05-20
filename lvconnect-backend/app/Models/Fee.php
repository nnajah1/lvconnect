<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fee extends Model
{
    use HasFactory;

    protected $fillable = [
        'fee_template_id',
        'fee_category_id',
        'fee_name',
        'amount',
    ];

    /**
     * The template this fee belongs to.
     */
    public function feeTemplate()
    {
        return $this->belongsTo(FeeTemplate::class);
    }

    /**
     * The category this fee falls under.
     */
    public function feeCategory()
    {
        return $this->belongsTo(FeeCategory::class);
    }
}
