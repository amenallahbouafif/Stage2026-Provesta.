<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index()
    {
        $stocks = Stock::with(['produit', 'mouvements'])->get();

        return response()->json($stocks, 200);
    }

    public function show($id)
    {
        $stock = Stock::with(['produit', 'mouvements'])->find($id);

        if (!$stock) {
            return response()->json(['message' => 'Stock introuvable'], 404);
        }

        return response()->json($stock, 200);
    }
}
