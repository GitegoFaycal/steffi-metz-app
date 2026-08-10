<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';
corsHeaders();

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        if ($id) {
            $order = $db->fetchOne("SELECT * FROM orders WHERE id = ?", [$id]);
            if (!$order) jsonError('Order not found.', 404);
            jsonResponse(['success' => true, 'order' => $order]);
        } else {
            $orders = $db->fetchAll("SELECT * FROM orders ORDER BY id DESC");
            jsonResponse(['success' => true, 'orders' => $orders]);
        }
        break;

    case 'POST':
        $input = getJsonInput();
        $oid = $db->insert('orders', [
            'customer_name' => $input['customer_name'] ?? '',
            'phone' => $input['phone'] ?? '',
            'email' => $input['email'] ?? null,
            'item' => $input['item'] ?? '',
            'amount' => $input['amount'] ?? 0,
            'notes' => $input['notes'] ?? null,
        ]);
        $order = $db->fetchOne("SELECT * FROM orders WHERE id = ?", [$oid]);
        jsonResponse(['success' => true, 'message' => 'Order created.', 'order' => $order], 201);
        break;

    case 'PUT':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM orders WHERE id = ?", [$id]);
        if (!$existing) jsonError('Order not found.', 404);
        $input = getJsonInput();
        $data = [];
        foreach (['customer_name', 'phone', 'email', 'item', 'amount', 'notes', 'status', 'payment_status'] as $f) {
            if (array_key_exists($f, $input)) $data[$f] = $input[$f];
        }
        if (!empty($data)) $db->update('orders', $data, 'id = ?', [$id]);
        $order = $db->fetchOne("SELECT * FROM orders WHERE id = ?", [$id]);
        jsonResponse(['success' => true, 'message' => 'Order updated.', 'order' => $order]);
        break;

    case 'DELETE':
        if (!$id) jsonError('ID required');
        if (!$db->fetchOne("SELECT * FROM orders WHERE id = ?", [$id])) jsonError('Order not found.', 404);
        $db->delete('orders', 'id = ?', [$id]);
        jsonResponse(['success' => true, 'message' => 'Order deleted.']);
        break;

    default:
        jsonError('Method not allowed', 405);
}
