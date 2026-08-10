<?php
$pdo = new PDO('sqlite:' . __DIR__ . '/database/database.sqlite');
$emails = ['admin@provesta.com', 'gestionnaire@provesta.com', 'achats@provesta.com'];
foreach ($emails as $email) {
    $stmt = $pdo->prepare('SELECT mot_de_passe FROM utilisateurs WHERE email = ?');
    $stmt->execute([$email]);
    $hash = $stmt->fetchColumn();
    if (!$hash) {
        echo "$email => NOT FOUND\n";
        continue;
    }
    $ok = password_verify('password', $hash) ? 'OK' : 'FAIL';
    echo "$email => $ok\n";
}
