<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $table = 'stocks';

    protected $fillable = [
        'quantite',
        'entrepot',
        'produit_id',
    ];

    /**
     * Le produit auquel appartient ce stock
     */
    public function produit()
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }

    /**
     * L'historique des mouvements de ce stock
     */
    public function mouvements()
    {
        return $this->hasMany(MouvementStock::class, 'stock_id');
    }

    /**
     * Vérifie si la quantité demandée est disponible
     */
    public function verifierDisponibilite(int $quantiteDemandee): bool
    {
        return $this->quantite >= $quantiteDemandee;
    }
}