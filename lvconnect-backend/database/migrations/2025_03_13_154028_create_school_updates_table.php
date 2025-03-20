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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('created_by'); // comms officer
            $table->unsignedBigInteger('approved_by')->nullable(); // school admin
            $table->enum('type', ['announcement', 'event']); 
            $table->string('title');
            $table->text('content');
            $table->string('image_url')->nullable();
            $table->string('status')->default('draft'); // draft, pending, approved, rejected, for_revision
            $table->json('revision_fields')->nullable();
            $table->text('revision_remarks')->nullable();
            $table->boolean('post_to_facebook')->default(false);
            $table->string('facebook_post_id')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();
        
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_updates');
    }
};
