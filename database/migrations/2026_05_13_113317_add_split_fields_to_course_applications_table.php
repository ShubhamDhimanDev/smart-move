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
        Schema::table('course_applications', function (Blueprint $table) {
            $table->string('nationality')->nullable()->after('nationality_immigration_status');
            $table->string('immigration_status')->nullable()->after('nationality');
            $table->string('preferred_course')->nullable()->after('preferred_course_location');
            $table->string('preferred_location')->nullable()->after('preferred_course');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_applications', function (Blueprint $table) {
            $table->dropColumn([
                'nationality',
                'immigration_status',
                'preferred_course',
                'preferred_location',
            ]);
        });
    }
};
