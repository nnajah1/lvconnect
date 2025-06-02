<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalendarOfActivity extends Model
{
    protected $fillable = [
        'event_title',
        'description',
        'start_date',
        'end_date',
        'created_by',
        'color',
    ];

    protected $casts = [
    'start_date' => 'date:Y-m-d',
    'end_date' => 'date:Y-m-d',
];


    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
