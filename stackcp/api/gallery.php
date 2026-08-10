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
            $item = $db->fetchOne("SELECT * FROM gallery WHERE id = ?", [$id]);
            if (!$item) jsonError('Gallery item not found.', 404);
            jsonResponse(['success' => true, 'gallery' => $item]);
        } else {
            $items = $db->fetchAll("SELECT * FROM gallery ORDER BY id DESC");
            jsonResponse(['success' => true, 'gallery' => $items]);
        }
        break;

    case 'POST':
        $input = getJsonInput();
        $gid = $db->insert('gallery', [
            'title' => $input['title'] ?? '',
            'category' => $input['category'] ?? null,
            'image' => $input['image'] ?? '',
        ]);
        $item = $db->fetchOne("SELECT * FROM gallery WHERE id = ?", [$gid]);
        jsonResponse(['success' => true, 'message' => 'Gallery item created.', 'gallery' => $item], 201);
        break;

    case 'PUT':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM gallery WHERE id = ?", [$id]);
        if (!$existing) jsonError('Gallery item not found.', 404);
        $input = getJsonInput();
        $data = [];
        foreach (['title', 'category', 'image'] as $f) {
            if (array_key_exists($f, $input)) $data[$f] = $input[$f];
        }
        if (!empty($data)) $db->update('gallery', $data, 'id = ?', [$id]);
        $item = $db->fetchOne("SELECT * FROM gallery WHERE id = ?", [$id]);
        jsonResponse(['success' => true, 'message' => 'Gallery item updated.', 'gallery' => $item]);
        break;

    case 'DELETE':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM gallery WHERE id = ?", [$id]);
        if (!$existing) jsonError('Gallery item not found.', 404);
        $db->delete('gallery', 'id = ?', [$id]);
        jsonResponse(['success' => true, 'message' => 'Gallery item deleted.']);
        break;

    default:
        jsonError('Method not allowed', 405);
}
