<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('form_types', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('pdf_path')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('description')->nullable();
            $table->boolean('has_pdf');
            $table->boolean('is_visible')->default(false); //toggle
            $table->longText('content')->nullable();
            $table->timestamps();
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
