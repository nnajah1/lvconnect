<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enrollee_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_information_id')->constrained('student_information')->onDelete('cascade');
            $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');
            $table->foreignId('enrollment_schedule_id')->constrained('enrollment_schedules')->onDelete('cascade');
            $table->integer('year_level');
            $table->boolean('privacy_policy');
            $table->enum('enrollment_status', ['pending', 'enrolled', 'not_enrolled', 'rejected', 'archived']);
            $table->string('admin_remarks');
            $table->timestamp('submission_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollee_records');
    }
};
