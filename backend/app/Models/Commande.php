<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $table = 'commandes';

    protected $fillable = [
        'numero_commande',
        'date_commande',
        'date_livraison_prevue',
        'statut',
        'montant_total',
        'fournisseur_id',
        'utilisateur_id',
    ];

    /**
     * Le fournisseur auprès duquel la commande est passée
     */
    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class, 'fournisseur_id');
    }

    /**
     * L'utilisateur (Responsable achats) qui a créé la commande
     */
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    /**
     * Les lignes de cette commande
     */
    public function lignesCommande()
    {
        return $this->hasMany(LigneCommande::class, 'commande_id');
    }

    /**
     * Calcule et met à jour le montant total à partir des lignes de commande
     */
    public function calculerMontantTotal(): float
    {
        $total = $this->lignesCommande->sum(function ($ligne) {
            return $ligne->quantite * $ligne->prix_unitaire;
        });

        $this->montant_total = $total;
        $this->save();

        return $total;
    }

    /**
     * Change le statut de la commande
     */
    public function mettreAJourStatut(string $nouveauStatut): void
    {
        $this->statut = $nouveauStatut;
        $this->save();
    }

    /**
     * Annule la commande
     */
    public function annulerCommande(): void
    {
        $this->mettreAJourStatut('annulee');
    }
}