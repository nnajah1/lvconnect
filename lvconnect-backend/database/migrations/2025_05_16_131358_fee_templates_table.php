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
        Schema::create('fee_templates', function (Blueprint $table) {
            $table->id();

            // Tuition details
            $table->decimal('tuition_per_unit', 10, 2)->default(0);
            $table->integer('total_units')->default(0);
            $table->decimal('tuition_total', 10, 2)->default(0);

            // Miscellaneous breakdown 
            $table->decimal('miscellaneous_total', 10, 2)->default(0);

            // Per term totals
            $table->decimal('first_term_total', 10, 2)->default(0);   // tuition + misc
            $table->decimal('second_term_total', 10, 2)->default(0);  // tuition + misc

            // Full academic year and scholarship
            $table->decimal('whole_academic_year', 10, 2)->default(0); // sum of 1st + 2nd
            $table->decimal('scholarship_discount', 10, 2)->default(0); // same as whole_academic_year
            $table->decimal('total_payment', 10, 2)->default(0);        // always 0 for full scholars

            // Metadata
            $table->enum('status', ['saved', 'archived']);
            $table->boolean('is_visible')->default(false);
            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
