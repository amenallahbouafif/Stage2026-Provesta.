<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\Commande;
use App\Models\Fournisseur;
use App\Models\LigneCommande;
use App\Models\Produit;
use App\Models\Stock;
use App\Models\Utilisateur;
use Database\Seeders\UtilisateurSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = Utilisateur::create([
            'nom' => 'Administrateur',
            'email' => 'admin@example.com',
            'mot_de_passe' => Hash::make('password'),
            'role' => 'administrateur',
        ]);

        Utilisateur::create([
            'nom' => 'Test User',
            'email' => 'test@provesta.com',
            'mot_de_passe' => Hash::make('password'),
            'role' => 'responsable_achats',
        ]);

        $categories = collect([
            ['libelle' => 'Électronique'],
            ['libelle' => 'Fournitures'],
            ['libelle' => 'Consommables'],
        ])->map(fn ($category) => Categorie::create($category));

        $fournisseurs = collect([
            ['nom' => 'Fournisseur Alpha', 'contact' => 'alpha@example.com', 'delai_livraison_moyen' => 4],
            ['nom' => 'Fournisseur Bêta', 'contact' => 'beta@example.com', 'delai_livraison_moyen' => 7],
        ])->map(fn ($provider) => Fournisseur::create($provider));

        $produits = collect([
            ['nom' => 'Imprimante laser', 'prix_unitaire' => 399.99, 'seuil_alerte' => 2, 'categorie_id' => $categories[1]->id],
            ['nom' => 'Ordinateur portable', 'prix_unitaire' => 1299.50, 'seuil_alerte' => 1, 'categorie_id' => $categories[0]->id],
            ['nom' => 'Papier A4 (500 feuilles)', 'prix_unitaire' => 24.90, 'seuil_alerte' => 10, 'categorie_id' => $categories[2]->id],
        ])->map(function ($product) {
            $produit = Produit::create($product);
            Stock::create([
                'produit_id' => $produit->id,
                'quantite' => random_int(5, 25),
                'entrepot' => 'Entrepôt principal',
            ]);

            return $produit;
        });

        $commande = Commande::create([
            'numero_commande' => 'CMD-' . strtoupper(uniqid()),
            'date_commande' => now(),
            'date_livraison_prevue' => now()->addDays(5),
            'statut' => 'en_attente',
            'montant_total' => 0,
            'fournisseur_id' => $fournisseurs[0]->id,
            'utilisateur_id' => $admin->id,
        ]);

        LigneCommande::create([
            'commande_id' => $commande->id,
            'produit_id' => $produits[0]->id,
            'quantite' => 2,
            'prix_unitaire' => $produits[0]->prix_unitaire,
        ]);

        $commande->calculerMontantTotal();

        $this->call(UtilisateurSeeder::class);
    }
}
