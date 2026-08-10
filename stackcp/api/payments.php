<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';
corsHeaders();

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $payments = $db->fetchAll("SELECT * FROM payments ORDER BY id DESC");
        jsonResponse(['success' => true, 'payments' => $payments]);
        break;

    case 'POST':
        $input = getJsonInput();
        $pid = $db->insert('payments', [
            'order_id' => $input['order_id'] ?? null,
            'amount' => $input['amount'] ?? 0,
            'method' => $input['method'] ?? null,
            'status' => $input['status'] ?? 'paid-demo',
        ]);
        $payment = $db->fetchOne("SELECT * FROM payments WHERE id = ?", [$pid]);
        jsonResponse(['success' => true, 'message' => 'Payment recorded.', 'payment' => $payment], 201);
        break;

    default:
        jsonError('Method not allowed', 405);
}
