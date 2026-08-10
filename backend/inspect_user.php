<?php
$db = __DIR__ . '/database/database.sqlite';
if (!file_exists($db)) {
    echo "MISSING DB\n";
    exit(1);
}
$pdo = new PDO('sqlite:' . $db);
try {
    $rows = $pdo->query('SELECT id, email, mot_de_passe, role FROM utilisateurs')->fetchAll(PDO::FETCH_ASSOC);
    echo "ROWS=" . count($rows) . "\n";
    foreach ($rows as $row) {
        echo json_encode($row, JSON_UNESCAPED_UNICODE) . "\n";
        echo 'CHECK=' . (password_verify('password', $row['mot_de_passe']) ? 'TRUE' : 'FALSE') . "\n";
    }
} catch (Throwable $e) {
    echo 'ERROR: ' . $e->getMessage() . "\n";
}
