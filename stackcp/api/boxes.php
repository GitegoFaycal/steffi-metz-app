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
            $box = $db->fetchOne("SELECT * FROM boxes WHERE id = ?", [$id]);
            if (!$box) jsonError('Box not found.', 404);
            $box['items'] = $box['items'] ? array_map('trim', explode(',', $box['items'])) : [];
            jsonResponse(['success' => true, 'box' => $box]);
        } elseif (isset($_GET['keyword'])) {
            $kw = '%' . $_GET['keyword'] . '%';
            $boxes = $db->fetchAll(
                "SELECT * FROM boxes WHERE name LIKE ? OR price LIKE ? OR serves LIKE ? OR items LIKE ? ORDER BY id DESC",
                [$kw, $kw, $kw, $kw]
            );
            foreach ($boxes as &$b) {
                $b['items'] = $b['items'] ? array_map('trim', explode(',', $b['items'])) : [];
            }
            jsonResponse(['success' => true, 'boxes' => $boxes]);
        } else {
            $boxes = $db->fetchAll("SELECT * FROM boxes ORDER BY id DESC");
            foreach ($boxes as &$b) {
                $b['items'] = $b['items'] ? array_map('trim', explode(',', $b['items'])) : [];
            }
            jsonResponse(['success' => true, 'boxes' => $boxes]);
        }
        break;

    case 'POST':
        $input = getJsonInput();
        $items = isset($input['items']) ? (is_array($input['items']) ? implode(', ', $input['items']) : $input['items']) : '';
        $boxId = $db->insert('boxes', [
            'name' => $input['name'] ?? '',
            'price' => $input['price'] ?? '',
            'serves' => $input['serves'] ?? null,
            'items' => $items,
            'image' => $input['image'] ?? null,
            'status' => $input['status'] ?? 'active',
        ]);
        $box = $db->fetchOne("SELECT * FROM boxes WHERE id = ?", [$boxId]);
        $box['items'] = $box['items'] ? array_map('trim', explode(',', $box['items'])) : [];
        jsonResponse(['success' => true, 'message' => 'Box created successfully.', 'box' => $box], 201);
        break;

    case 'PUT':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM boxes WHERE id = ?", [$id]);
        if (!$existing) jsonError('Box not found.', 404);
        $input = getJsonInput();
        $data = [];
        $fields = ['name', 'price', 'serves', 'image', 'status'];
        foreach ($fields as $f) {
            if (array_key_exists($f, $input)) {
                $data[$f] = $input[$f];
            }
        }
        if (array_key_exists('items', $input)) {
            $data['items'] = is_array($input['items']) ? implode(', ', $input['items']) : $input['items'];
        }
        if (!empty($data)) {
            $db->update('boxes', $data, 'id = ?', [$id]);
        }
        $box = $db->fetchOne("SELECT * FROM boxes WHERE id = ?", [$id]);
        $box['items'] = $box['items'] ? array_map('trim', explode(',', $box['items'])) : [];
        jsonResponse(['success' => true, 'message' => 'Box updated successfully.', 'box' => $box]);
        break;

    case 'DELETE':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM boxes WHERE id = ?", [$id]);
        if (!$existing) jsonError('Box not found.', 404);
        $db->delete('boxes', 'id = ?', [$id]);
        jsonResponse(['success' => true, 'message' => 'Box deleted successfully.']);
        break;

    default:
        jsonError('Method not allowed', 405);
}
