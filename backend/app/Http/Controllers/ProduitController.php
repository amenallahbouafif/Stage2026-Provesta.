<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    /**
     * Liste tous les produits avec leur catégorie et leur stock
     */
    public function index()
    {
        $produits = Produit::with(['categorie', 'stock'])->get();

        return response()->json($produits, 200);
    }

    /**
     * Affiche un produit précis
     */
    public function show($id)
    {
        $produit = Produit::with(['categorie', 'stock'])->find($id);

        if (!$produit) {
            return response()->json(['message' => 'Produit introuvable'], 404);
        }

        return response()->json($produit, 200);
    }

    /**
     * Crée un nouveau produit
     */
    public function store(Request $request)
    {
        if (!in_array($request->user()->role, ['administrateur', 'gestionnaire_stock'])) {
            return response()->json(['message' => 'Accès non autorisé pour ce rôle'], 403);
        }

        $request->validate([
            'nom' => 'required|string',
            'prix_unitaire' => 'required|numeric',
            'seuil_alerte' => 'nullable|integer',
            'categorie_id' => 'required|exists:categories,id',
        ]);

        $produit = Produit::create($request->all());
        $produit->stock()->create([
            'quantite' => 0,
            'entrepot' => 'Entrepôt principal',
        ]);

        return response()->json($produit->load(['categorie', 'stock']), 201);
    }

    /**
     * Met à jour un produit existant
     */
    public function update(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['administrateur', 'gestionnaire_stock'])) {
            return response()->json(['message' => 'Accès non autorisé pour ce rôle'], 403);
        }

        $produit = Produit::find($id);

        if (!$produit) {
            return response()->json(['message' => 'Produit introuvable'], 404);
        }

        $produit->update($request->all());

        return response()->json($produit, 200);
    }

    /**
     * Supprime un produit
     */
    public function destroy($id)
    {
        if (!in_array(request()->user()->role, ['administrateur', 'gestionnaire_stock'])) {
            return response()->json(['message' => 'Accès non autorisé pour ce rôle'], 403);
        }

        $produit = Produit::find($id);

        if (!$produit) {
            return response()->json(['message' => 'Produit introuvable'], 404);
        }

        $produit->delete();

        return response()->json(['message' => 'Produit supprimé'], 200);
    }
}