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
    Schema::create('commandes', function (Blueprint $table) {
        $table->id();
        $table->string('numero_commande')->unique();
        $table->date('date_commande');
        $table->date('date_livraison_prevue')->nullable();
        $table->enum('statut', ['en_attente', 'validee', 'livree', 'annulee'])->default('en_attente');
        $table->decimal('montant_total', 10, 2)->default(0);
        $table->foreignId('fournisseur_id')->constrained('fournisseurs');
        $table->foreignId('utilisateur_id')->constrained('utilisateurs');
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
