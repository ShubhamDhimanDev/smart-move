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
        Schema::create('course_category_course_type', function (Blueprint $table) {
            $table->foreignId('course_category_id')->constrained('course_categories')->cascadeOnDelete();
            $table->foreignId('course_type_id')->constrained('course_types')->cascadeOnDelete();
            $table->primary(['course_category_id', 'course_type_id']);
        });

        // Drop the old single-category FK column now replaced by the pivot
        Schema::table('course_types', function (Blueprint $table) {
            $table->dropForeign(['course_category_id']);
            $table->dropColumn('course_category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_category_course_type');

        Schema::table('course_types', function (Blueprint $table) {
            $table->foreignId('course_category_id')->nullable()->constrained('course_categories')->cascadeOnDelete();
        });
    }
};
