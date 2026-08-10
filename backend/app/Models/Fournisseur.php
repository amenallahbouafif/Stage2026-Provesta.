<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    protected $table = 'fournisseurs';

    protected $fillable = [
        'nom',
        'contact',
        'delai_livraison_moyen',
    ];

    /**
     * Les commandes passées auprès de ce fournisseur
     */
    public function commandes()
    {
        return $this->hasMany(Commande::class, 'fournisseur_id');
    }
}