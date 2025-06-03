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
        Schema::create('grade_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_information_id')->constrained('student_information')->onDelete('cascade');
            $table->string('term');
            $table->string('school_year');
            $table->decimal('target_GWA', 4,2);
            $table->decimal('actual_GWA', 4,2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grade_templates');
    }
};
