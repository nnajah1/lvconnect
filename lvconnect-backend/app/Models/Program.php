<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
        'program_name','year_level', 'created_at'
    ];

    public function enrollees() {
        return $this->hasMany(EnrolleeRecord::class);
    }
    

}
