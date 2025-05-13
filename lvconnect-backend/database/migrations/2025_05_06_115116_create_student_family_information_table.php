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
        Schema::create('student_family_information', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_information_id');
            $table->integer('num_children_in_family');
            $table->integer('birth_order');
            $table->string('has_siibling_in_lvcc');
            $table->string('mother_first_name');
            $table->string('mother_middle_name');
            $table->string('mother_last_name');
            $table->string('mother_religion');
            $table->string('mother_occupation');
            $table->string('mother_monthly_income');
            $table->string('mother_mobile_number');
            $table->string('father_first_name');
            $table->string('father_middle_name');
            $table->string('father_last_name');
            $table->string('father_religion');
            $table->string('father_occupation');
            $table->string('father_monthly_income');
            $table->string('father_mobile_number');
            $table->string('guardian_first_name');
            $table->string('guardian_middle_name');
            $table->string('guardian_last_name');
            $table->string('guardian_religion');
            $table->string('guardian_occupation');
            $table->string('guardian_monthly_income');
            $table->string('guardian_mobile_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_family_information');
    }
};
