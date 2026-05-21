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
        Schema::table('course_categories', function (Blueprint $table) {
            $table->boolean('is_featured_home')->default(false)->index()->after('is_featured');
            $table->boolean('is_featured_nav')->default(false)->index()->after('is_featured_home');
        });

        Schema::table('cities', function (Blueprint $table) {
            $table->boolean('is_featured_home')->default(false)->index()->after('is_featured');
            $table->boolean('is_featured_nav')->default(false)->index()->after('is_featured_home');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_categories', function (Blueprint $table) {
            $table->dropColumn(['is_featured_home', 'is_featured_nav']);
        });

        Schema::table('cities', function (Blueprint $table) {
            $table->dropColumn(['is_featured_home', 'is_featured_nav']);
        });
    }
};
