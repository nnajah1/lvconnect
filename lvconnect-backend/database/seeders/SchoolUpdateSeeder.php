<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SchoolUpdate;

class SchoolUpdateSeeder extends Seeder
{
    public function run(): void
    {
        SchoolUpdate::factory()->count(10)->create();
    }
}
