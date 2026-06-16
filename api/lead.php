<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['detail' => 'Method not allowed']);
    exit;
}

$body = file_get_contents('php://input');
if ($body === false || $body === '') {
    http_response_code(400);
    echo json_encode(['detail' => 'Empty body']);
    exit;
}

$upstream = 'https://app.twinlabs.ru/qmagic/v1/lead';
$secret = 'volki_cy1-hzaPfi36HtQ2LAkfpm_7Q3AlR6w6';

$ch = curl_init($upstream);
if ($ch === false) {
    http_response_code(502);
    echo json_encode(['detail' => 'Upstream unavailable']);
    exit;
}

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'X-Qmagic-Secret: ' . $secret,
        'X-Forwarded-For: ' . ($_SERVER['REMOTE_ADDR'] ?? ''),
    ],
]);

$response = curl_exec($ch);
$errno = curl_errno($ch);
$code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($errno !== 0 || $response === false) {
    http_response_code(502);
    echo json_encode(['detail' => 'Upstream error']);
    exit;
}

http_response_code($code > 0 ? $code : 502);
echo $response;
