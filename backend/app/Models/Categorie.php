<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'libelle',
    ];

    /**
     * Les produits appartenant à cette catégorie
     */
    public function produits()
    {
        return $this->hasMany(Produit::class, 'categorie_id');
    }
}
