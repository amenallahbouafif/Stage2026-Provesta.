<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LigneCommande extends Model
{
    protected $table = 'ligne_commandes';

    protected $fillable = [
        'quantite',
        'prix_unitaire',
        'commande_id',
        'produit_id',
    ];

    /**
     * La commande à laquelle appartient cette ligne
     */
    public function commande()
    {
        return $this->belongsTo(Commande::class, 'commande_id');
    }

    /**
     * Le produit concerné par cette ligne
     */
    public function produit()
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }

    /**
     * Calcule le sous-total de cette ligne (quantité x prix unitaire)
     */
    public function calculerSousTotal(): float
    {
        return $this->quantite * $this->prix_unitaire;
    }
}