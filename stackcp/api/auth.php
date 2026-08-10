<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';
corsHeaders();

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = rtrim($path, '/');

function generateJWT($user) {
    $secret = getenv('JWT_SECRET') ?: 'steffi_metz_secret_key';
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $payload = [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
        'iat' => time(),
        'exp' => time() + (7 * 24 * 60 * 60),
    ];
    $headerB64 = rtrim(strtr(base64_encode(json_encode($header)), '+/', '-_'), '=');
    $payloadB64 = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
    $signature = hash_hmac('sha256', "$headerB64.$payloadB64", $secret, true);
    $signatureB64 = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
    return "$headerB64.$payloadB64.$signatureB64";
}

if ($method === 'POST' && str_ends_with($path, '/auth/login')) {
    $input = getJsonInput();
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (!$email || !$password) {
        jsonError('Email and password are required.', 400);
    }

    $user = $db->fetchOne("SELECT id, name, email, password, role FROM users WHERE email = ?", [$email]);

    if (!$user) {
        jsonError('Invalid email or password.', 401);
    }

    $passwordMatch = false;
    if (str_starts_with($user['password'], '$2a$') || str_starts_with($user['password'], '$2y$') || str_starts_with($user['password'], '$2b$')) {
        $passwordMatch = password_verify($password, $user['password']);
    } else {
        $passwordMatch = ($password === $user['password']);
    }

    if (!$passwordMatch) {
        jsonError('Invalid email or password.', 401);
    }

    $token = generateJWT($user);

    jsonResponse([
        'success' => true,
        'message' => 'Login successful.',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ],
    ]);
}

if ($method === 'POST' && str_ends_with($path, '/auth/create-initial-admin')) {
    $existing = $db->fetchOne("SELECT id FROM users LIMIT 1");
    if ($existing) {
        jsonError('Admin user already exists.', 400);
    }

    $name = 'Admin User';
    $email = 'admin@steffi.com';
    $plainPassword = 'admin123';
    $role = 'admin';

    $hashedPassword = password_hash($plainPassword, PASSWORD_BCRYPT);

    $uid = $db->insert('users', [
        'name' => $name,
        'email' => $email,
        'password' => $hashedPassword,
        'role' => $role,
    ]);

    jsonResponse([
        'success' => true,
        'message' => 'Initial admin created successfully.',
        'admin' => ['id' => $uid, 'name' => $name, 'email' => $email, 'role' => $role],
        'login' => ['email' => $email, 'password' => $plainPassword],
    ], 201);
}

if ($method === 'GET' && str_ends_with($path, '/auth/me')) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!str_starts_with($authHeader, 'Bearer ')) {
        jsonError('Not authenticated.', 401);
    }

    $token = substr($authHeader, 7);
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        jsonError('Invalid token.', 401);
    }

    list($headerB64, $payloadB64, $signatureB64) = $parts;

    $secret = getenv('JWT_SECRET') ?: 'steffi_metz_secret_key';
    $expectedSig = rtrim(strtr(base64_encode(hash_hmac('sha256', "$headerB64.$payloadB64", $secret, true)), '+/', '-_'), '=');

    if (!hash_equals($expectedSig, $signatureB64)) {
        jsonError('Invalid token.', 401);
    }

    $payload = json_decode(base64_decode(strtr($payloadB64, '-_', '+/')), true);
    if (!$payload || (isset($payload['exp']) && $payload['exp'] < time())) {
        jsonError('Token expired.', 401);
    }

    jsonResponse([
        'success' => true,
        'user' => [
            'id' => $payload['id'],
            'name' => $payload['name'],
            'email' => $payload['email'],
            'role' => $payload['role'],
        ],
    ]);
}

jsonError('Route not found', 404);
