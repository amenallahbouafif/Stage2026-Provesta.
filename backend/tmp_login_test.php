<?php
$ch = curl_init('http://127.0.0.1:8000/api/login');
$data = json_encode(['email' => 'admin@provesta.com', 'password' => 'password']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if (curl_errno($ch)) {
    echo 'CURL ERROR: ' . curl_error($ch) . PHP_EOL;
} else {
    echo 'STATUS: ' . $code . PHP_EOL;
    echo $response . PHP_EOL;
}
curl_close($ch);
