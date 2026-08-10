<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    /**
     * Liste toutes les commandes avec leurs lignes, fournisseur et utilisateur
     */
    public function index()
    {
        $commandes = Commande::with(['lignesCommande.produit', 'fournisseur', 'utilisateur'])->get();

        return response()->json($commandes, 200);
    }

    /**
     * Affiche une commande précise (pour suivre son statut)
     */
    public function show($id)
    {
        $commande = Commande::with(['lignesCommande.produit', 'fournisseur', 'utilisateur'])->find($id);

        if (!$commande) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }

        return response()->json($commande, 200);
    }

    /**
     * Créer une commande d'approvisionnement
     * Reprend exactement le diagramme de séquence :
     * vérifier le stock -> créer la commande -> créer les lignes -> calculer le montant
     */
    public function store(Request $request)
    {
        if (!in_array($request->user()->role, ['administrateur', 'responsable_achats'])) {
            return response()->json(['message' => 'Accès non autorisé pour ce rôle'], 403);
        }

        $request->validate([
            'fournisseur_id' => 'required|exists:fournisseurs,id',
            'lignes' => 'required|array|min:1',
            'lignes.*.produit_id' => 'required|exists:produits,id',
            'lignes.*.quantite' => 'required|integer|min:1',
            'lignes.*.prix_unitaire' => 'required|numeric|min:0',
        ]);

        // Vérification de la disponibilité du stock pour chaque produit demandé
        foreach ($request->lignes as $ligne) {
            $produit = Produit::with('stock')->find($ligne['produit_id']);

            if (!$produit->stock || !$produit->stock->verifierDisponibilite($ligne['quantite'])) {
                return response()->json([
                    'message' => "Stock insuffisant pour le produit : {$produit->nom}",
                ], 422);
            }
        }

        // Transaction : soit tout réussit, soit rien n'est enregistré
        $commande = DB::transaction(function () use ($request) {
            $commande = Commande::create([
                'numero_commande' => 'CMD-' . strtoupper(uniqid()),
                'date_commande' => now(),
                'date_livraison_prevue' => $request->date_livraison_prevue,
                'statut' => 'en_attente',
                'montant_total' => 0,
                'fournisseur_id' => $request->fournisseur_id,
                'utilisateur_id' => $request->user()->id,
            ]);

            foreach ($request->lignes as $ligne) {
                LigneCommande::create([
                    'commande_id' => $commande->id,
                    'produit_id' => $ligne['produit_id'],
                    'quantite' => $ligne['quantite'],
                    'prix_unitaire' => $ligne['prix_unitaire'],
                ]);
            }

            $commande->load('lignesCommande');
            $commande->calculerMontantTotal();

            return $commande;
        });

        return response()->json($commande, 201);
    }

    /**
     * Met à jour le statut d'une commande (ex. suivi ou mise à jour livraison)
     */
    public function mettreAJourStatut(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['administrateur', 'responsable_achats'])) {
            return response()->json(['message' => 'Accès non autorisé pour ce rôle'], 403);
        }

        $request->validate([
            'statut' => 'required|in:en_attente,validee,livree,annulee',
        ]);

        $commande = Commande::find($id);

        if (!$commande) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }

        $commande->mettreAJourStatut($request->statut);

        return response()->json($commande, 200);
    }
}
