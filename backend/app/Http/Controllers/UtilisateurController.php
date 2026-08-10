<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UtilisateurController extends Controller
{
    public function index()
    {
        $utilisateurs = Utilisateur::all();

        return response()->json($utilisateurs, 200);
    }

    public function show($id)
    {
        $utilisateur = Utilisateur::find($id);

        if (!$utilisateur) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        return response()->json($utilisateur, 200);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'administrateur') {
            return response()->json(['message' => 'Accès non autorisé pour ce rôle'], 403);
        }

        $request->validate([
            'nom' => 'required|string',
            'email' => 'required|email|unique:utilisateurs,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:administrateur,gestionnaire_stock,responsable_achats',
        ]);

        $utilisateur = Utilisateur::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'mot_de_passe' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json($utilisateur, 201);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'administrateur') {
            return response()->json(['message' => 'Accès non autorisé pour ce rôle'], 403);
        }

        $request->validate([
            'nom' => 'required|string',
            'email' => "required|email|unique:utilisateurs,email,{$id}",
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:administrateur,gestionnaire_stock,responsable_achats',
        ]);

        $utilisateur = Utilisateur::find($id);

        if (!$utilisateur) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        $data = [
            'nom' => $request->nom,
            'email' => $request->email,
            'role' => $request->role,
        ];

        if ($request->filled('password')) {
            $data['mot_de_passe'] = Hash::make($request->password);
        }

        $utilisateur->update($data);

        return response()->json($utilisateur, 200);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'administrateur') {
            return response()->json(['message' => 'Accès non autorisé pour ce rôle'], 403);
        }

        $utilisateur = Utilisateur::find($id);

        if (!$utilisateur) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        $utilisateur->delete();

        return response()->json(['message' => 'Utilisateur supprimé'], 200);
    }
}
