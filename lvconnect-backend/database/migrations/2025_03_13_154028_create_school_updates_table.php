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
        Schema::create('school_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('type', ['announcement', 'event']); 
            $table->string('title');
            $table->text('content');
            $table->string('image_url')->nullable();
            $table->string('status')->default('draft'); // draft, pending, approved, rejected, for_revision, published
            $table->boolean('is_notified')->default(false);
            $table->boolean('is_urgent')->default(false);
            $table->json('revision_fields')->nullable();
            $table->text('revision_remarks')->nullable();
            $table->string('facebook_post_id')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
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
