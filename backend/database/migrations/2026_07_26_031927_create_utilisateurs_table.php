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
    {Schema::create('utilisateurs', function (Blueprint $table) {
        $table->id();
        $table->string('nom');
        $table->string('email')->unique();
        $table->string('mot_de_passe');
        $table->enum('role', ['administrateur', 'gestionnaire_stock', 'responsable_achats']);
        $table->timestamp('derniere_connexion')->nullable();
        $table->timestamps();
    });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};
