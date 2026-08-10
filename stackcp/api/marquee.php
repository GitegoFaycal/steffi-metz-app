<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';
corsHeaders();

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        if (isset($_GET['admin'])) {
            $items = $db->fetchAll("SELECT * FROM marquee_items ORDER BY sort_order ASC, id ASC");
        } else {
            $items = $db->fetchAll("SELECT * FROM marquee_items WHERE status = 'active' ORDER BY sort_order ASC, id ASC");
        }
        jsonResponse(['success' => true, 'marquee' => $items]);
        break;

    case 'POST':
        $input = getJsonInput();
        $mid = $db->insert('marquee_items', [
            'text' => $input['text'] ?? '',
            'sort_order' => $input['sort_order'] ?? 0,
            'status' => $input['status'] ?? 'active',
        ]);
        $item = $db->fetchOne("SELECT * FROM marquee_items WHERE id = ?", [$mid]);
        jsonResponse(['success' => true, 'message' => 'Marquee item created.', 'marquee' => $item], 201);
        break;

    case 'PUT':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM marquee_items WHERE id = ?", [$id]);
        if (!$existing) jsonError('Marquee item not found.', 404);
        $input = getJsonInput();
        $data = [];
        foreach (['text', 'sort_order', 'status'] as $f) {
            if (array_key_exists($f, $input)) $data[$f] = $input[$f];
        }
        if (!empty($data)) $db->update('marquee_items', $data, 'id = ?', [$id]);
        $item = $db->fetchOne("SELECT * FROM marquee_items WHERE id = ?", [$id]);
        jsonResponse(['success' => true, 'message' => 'Marquee item updated.', 'marquee' => $item]);
        break;

    case 'DELETE':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM marquee_items WHERE id = ?", [$id]);
        if (!$existing) jsonError('Marquee item not found.', 404);
        $db->delete('marquee_items', 'id = ?', [$id]);
        jsonResponse(['success' => true, 'message' => 'Marquee item deleted.']);
        break;

    default:
        jsonError('Method not allowed', 405);
}
