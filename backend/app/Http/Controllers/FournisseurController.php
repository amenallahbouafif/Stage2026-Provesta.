<?php

namespace App\Http\Controllers;

use App\Models\Fournisseur;
use Illuminate\Http\Request;

class FournisseurController extends Controller
{
    /**
     * Liste tous les fournisseurs
     */
    public function index()
    {
        $fournisseurs = Fournisseur::all();

        return response()->json($fournisseurs, 200);
    }

    /**
     * Affiche un fournisseur précis avec ses commandes
     */
    public function show($id)
    {
        $fournisseur = Fournisseur::with('commandes')->find($id);

        if (!$fournisseur) {
            return response()->json(['message' => 'Fournisseur introuvable'], 404);
        }

        return response()->json($fournisseur, 200);
    }

    /**
     * Crée un nouveau fournisseur
     */
    public function store(Request $request)
    {
        if (!in_array($request->user()->role, ['administrateur', 'responsable_achats'])) {
            return response()->json(['message' => 'Accès non autorisé pour ce rôle'], 403);
        }

        $request->validate([
            'nom' => 'required|string',
            'contact' => 'required|string',
            'delai_livraison_moyen' => 'nullable|integer',
        ]);

        $fournisseur = Fournisseur::create($request->all());

        return response()->json($fournisseur, 201);
    }

    /**
     * Met à jour un fournisseur
     */
    public function update(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['administrateur', 'responsable_achats'])) {
            return response()->json(['message' => 'Accès non autorisé pour ce rôle'], 403);
        }

        $fournisseur = Fournisseur::find($id);

        if (!$fournisseur) {
            return response()->json(['message' => 'Fournisseur introuvable'], 404);
        }

        $fournisseur->update($request->all());

        return response()->json($fournisseur, 200);
    }
}