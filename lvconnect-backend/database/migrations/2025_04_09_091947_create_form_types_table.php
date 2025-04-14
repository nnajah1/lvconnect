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
        Schema::create('form_types', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('pdf_path')->nullable();
            $table->unsignedBigInteger('created_by'); //PSAS admin
            $table->string('description')->nullable();
            $table->boolean('has_pdf');
            $table->boolean('is_visible')->default(false); //toggle
            $table->longText('content')->nullable();
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_types');
    }
};
