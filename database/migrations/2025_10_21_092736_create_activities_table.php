<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('type'); // e.g. 'to_do', 'blog_post', 'contact_manager'
            $table->string('description')->nullable(); // optional summary of the action
            $table->timestamps(); // created_at used for chart grouping
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
