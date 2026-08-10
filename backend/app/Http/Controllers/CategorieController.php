<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    public function index()
    {
        return response()->json(Categorie::all(), 200);
    }

    public function show($id)
    {
        $categorie = Categorie::with('produits')->find($id);

        if (!$categorie) {
            return response()->json(['message' => 'Catégorie introuvable'], 404);
        }

        return response()->json($categorie, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'libelle' => 'required|string|max:255',
        ]);

        $categorie = Categorie::create($request->all());

        return response()->json($categorie, 201);
    }

    public function update(Request $request, $id)
    {
        $categorie = Categorie::find($id);

        if (!$categorie) {
            return response()->json(['message' => 'Catégorie introuvable'], 404);
        }

        $request->validate([
            'libelle' => 'required|string|max:255',
        ]);

        $categorie->update($request->all());

        return response()->json($categorie, 200);
    }
}
