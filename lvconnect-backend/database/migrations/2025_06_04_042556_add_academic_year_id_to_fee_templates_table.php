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
        Schema::table('fee_templates', function (Blueprint $table) {
               $table->unsignedBigInteger('academic_year_id')->after('id');

           
            $table->foreign('academic_year_id')
                  ->references('id')->on('academic_years')
                  ->onDelete('cascade');
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fee_templates', function (Blueprint $table) {
            //
        });
    }
};
