<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $utilisateur = Utilisateur::where('email', $request->email)->first();

        if (!$utilisateur || !Hash::check($request->password, $utilisateur->mot_de_passe)) {
            return response()->json([
                'message' => 'Identifiants invalides',
            ], 401);
        }

        $token = $utilisateur->createToken('token_connexion')->plainTextToken;

        return response()->json([
            'utilisateur' => $utilisateur,
            'role' => $utilisateur->role,
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie',
        ], 200);
    }
}