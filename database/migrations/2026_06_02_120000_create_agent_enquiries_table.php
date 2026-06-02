<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agent_enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('company_name', 200)->nullable();
            $table->string('email', 200);
            $table->string('mobile', 40);
            $table->text('message');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agent_enquiries');
    }
};
