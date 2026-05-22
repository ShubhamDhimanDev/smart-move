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
        Schema::table('course_categories', function (Blueprint $table): void {
            $table->string('label')->nullable()->after('name');
            $table->boolean('is_featured_on_form')->default(false)->index()->after('is_featured_nav');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_categories', function (Blueprint $table): void {
            $table->dropColumn(['label', 'is_featured_on_form']);
        });
    }
};
