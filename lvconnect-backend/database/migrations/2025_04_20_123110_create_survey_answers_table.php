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
        Schema::create('survey_answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_information_id');
            $table->unsignedBigInteger('survey_question_id');
            $table->string('img_url');
            $table->timestamp('created_at');

            $table->foreign('survey_question_id')->references('id')->on('survey_questions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survey_answers');
    }
};
