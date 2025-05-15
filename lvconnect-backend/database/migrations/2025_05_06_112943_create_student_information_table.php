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
        Schema::create('student_information', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('student_id_number');
            $table->string('first_name');
            $table->string('middle_name');
            $table->string('last_name');
            $table->enum('civil_status', ['single', 'married', 'divorced', 'widowed']);
            $table->enum('gender',['male', 'female']);
            $table->date('birth_date');
            $table->string('birth_place');
            $table->string('mobile_number');
            $table->string('religion');
            $table->string('lrn');
            $table->string('fb_link');
            $table->enum('student_type',['regular', 'irregular']);
            $table->string('government_subsidy');
            $table->string('scholarship_status');
            $table->string('last_school_attended');
            $table->string('previous_school_address');
            $table->string('school_type');
            $table->string('academic_awards');
            $table->string('floor/unit/building_no');
            $table->string('house_no/street');
            $table->string('barangay');
            $table->string('city_municipality');
            $table->string('province');
            $table->integer('zip_code');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_information');
    }
};
