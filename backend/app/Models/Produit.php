<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    protected $table = 'produits';

    protected $fillable = [
        'nom',
        'prix_unitaire',
        'seuil_alerte',
        'categorie_id',
    ];

    /**
     * La catégorie à laquelle appartient ce produit
     */
    public function categorie()
    {
        return $this->belongsTo(Categorie::class, 'categorie_id');
    }

    /**
     * Le stock associé à ce produit
     */
    public function stock()
    {
        return $this->hasOne(Stock::class, 'produit_id');
    }

    /**
     * Les lignes de commande qui concernent ce produit
     */
    public function lignesCommande()
    {
        return $this->hasMany(LigneCommande::class, 'produit_id');
    }
}