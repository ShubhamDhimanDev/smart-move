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
        Schema::table('courses', function (Blueprint $table): void {
            $table->foreignId('course_type_id')->nullable()->constrained('course_types')->nullOnDelete()->after('course_category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table): void {
            $table->dropForeign(['course_type_id']);
            $table->dropColumn('course_type_id');
        });
    }
};
