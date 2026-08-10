<?php

namespace Database\Seeders;

use App\Models\Utilisateur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'email' => 'admin@provesta.com',
                'nom' => 'Admin Principal',
                'role' => 'administrateur',
                'mot_de_passe' => Hash::make('password'),
            ],
            [
                'email' => 'gestionnaire@provesta.com',
                'nom' => 'Gestionnaire Stock',
                'role' => 'gestionnaire_stock',
                'mot_de_passe' => Hash::make('password'),
            ],
            [
                'email' => 'achats@provesta.com',
                'nom' => 'Responsable Achats',
                'role' => 'responsable_achats',
                'mot_de_passe' => Hash::make('password'),
            ],
        ];

        foreach ($users as $userData) {
            Utilisateur::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'nom' => $userData['nom'],
                    'role' => $userData['role'],
                    'mot_de_passe' => $userData['mot_de_passe'],
                ]
            );
        }
    }
}
