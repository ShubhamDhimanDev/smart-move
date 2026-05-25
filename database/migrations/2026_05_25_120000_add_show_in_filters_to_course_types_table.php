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
        Schema::table('course_types', function (Blueprint $table) {
            $table->boolean('show_in_filters')->default(false)->index()->after('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_types', function (Blueprint $table) {
            $table->dropColumn('show_in_filters');
        });
    }
};
