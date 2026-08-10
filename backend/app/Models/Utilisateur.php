<?php

namespace App\Models;

use App\Models\Commande;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom',
        'email',
        'mot_de_passe',
        'role',
        'derniere_connexion',
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    public function commandes()
    {
        return $this->hasMany(Commande::class, 'utilisateur_id');
    }
}