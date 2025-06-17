<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('program_id');
            $table->unsignedBigInteger('course_id');

            $table->string('semester');
            $table->string('academic_year');
            $table->string('year_level');
            $table->string('day');

            $table->dateTime('start_time')->nullable();
            $table->dateTime('end_time')->nullable();

            $table->string('room')->nullable();
            $table->string('instructor')->nullable();

            $table->string('course_name')->nullable();
            $table->string('course_code')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
