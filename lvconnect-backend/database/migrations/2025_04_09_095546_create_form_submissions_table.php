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
        Schema::create('form_submissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('form_type_id');
            $table->unsignedBigInteger('submitted_by');
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected']);
            $table->timestamp('submitted_at');
            $table->string('admin_remarks');
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();

            $table->foreign('form_type_id')->references('id')->on('form_types')->onDelete('cascade');
            $table->foreign('submitted_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_submissions');
    }
};
