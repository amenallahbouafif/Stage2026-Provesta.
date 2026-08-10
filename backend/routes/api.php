<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\StockController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/produits', [ProduitController::class, 'index']);
    Route::get('/produits/{id}', [ProduitController::class, 'show']);
    Route::post('/produits', [ProduitController::class, 'store']);
    Route::put('/produits/{id}', [ProduitController::class, 'update']);
    Route::delete('/produits/{id}', [ProduitController::class, 'destroy']);

    Route::get('/commandes', [CommandeController::class, 'index']);
    Route::get('/commandes/{id}', [CommandeController::class, 'show']);
    Route::post('/commandes', [CommandeController::class, 'store']);
    Route::put('/commandes/{id}/statut', [CommandeController::class, 'mettreAJourStatut']);

    Route::get('/categories', [CategorieController::class, 'index']);
    Route::get('/categories/{id}', [CategorieController::class, 'show']);
    Route::post('/categories', [CategorieController::class, 'store']);
    Route::put('/categories/{id}', [CategorieController::class, 'update']);

    Route::get('/fournisseurs', [FournisseurController::class, 'index']);
    Route::get('/fournisseurs/{id}', [FournisseurController::class, 'show']);
    Route::post('/fournisseurs', [FournisseurController::class, 'store']);
    Route::put('/fournisseurs/{id}', [FournisseurController::class, 'update']);

    Route::get('/utilisateurs', [UtilisateurController::class, 'index']);
    Route::get('/utilisateurs/{id}', [UtilisateurController::class, 'show']);
    Route::post('/utilisateurs', [UtilisateurController::class, 'store']);
    Route::put('/utilisateurs/{id}', [UtilisateurController::class, 'update']);
    Route::delete('/utilisateurs/{id}', [UtilisateurController::class, 'destroy']);

    Route::get('/stocks', [StockController::class, 'index']);
    Route::get('/stocks/{id}', [StockController::class, 'show']);
});
