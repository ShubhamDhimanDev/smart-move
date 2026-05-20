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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->foreignId('course_category_id')->nullable()->constrained('course_categories')->nullOnDelete();
            $table->text('excerpt')->nullable();
            $table->string('status')->default('draft')->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->unsignedSmallInteger('duration')->nullable();
            $table->string('duration_unit', 20)->nullable();
            $table->string('level', 30)->nullable();
            $table->string('delivery_mode', 30)->nullable();
            $table->date('start_date')->nullable();
            $table->integer('sort_order')->default(0)->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
