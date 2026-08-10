<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MouvementStock extends Model
{
    protected $table = 'mouvement_stocks';

    protected $fillable = [
        'type',
        'quantite',
        'stock_id',
    ];

    /**
     * Le stock concerné par ce mouvement
     */
    public function stock()
    {
        return $this->belongsTo(Stock::class, 'stock_id');
    }

    /**
     * Enregistre le mouvement et met à jour la quantité du stock associé
     */
    public function enregistrerMouvement(): void
    {
        $stock = $this->stock;

        if ($this->type === 'entree') {
            $stock->quantite += $this->quantite;
        } else {
            $stock->quantite -= $this->quantite;
        }

        $stock->save();
    }
}