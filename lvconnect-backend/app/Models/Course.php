<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['course', 'unit'];

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }
}
