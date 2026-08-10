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
            $item = $db->fetchOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
            if (!$item) jsonError('Testimonial not found.', 404);
            jsonResponse(['success' => true, 'testimonial' => $item]);
        } else {
            $items = $db->fetchAll("SELECT * FROM testimonials WHERE status = 'active' ORDER BY id DESC");
            jsonResponse(['success' => true, 'testimonials' => $items]);
        }
        break;

    case 'POST':
        $input = getJsonInput();
        $tid = $db->insert('testimonials', [
            'customer_name' => $input['customer_name'] ?? '',
            'customer_title' => $input['customer_title'] ?? null,
            'rating' => $input['rating'] ?? 5,
            'message' => $input['message'] ?? '',
            'status' => $input['status'] ?? 'active',
        ]);
        $item = $db->fetchOne("SELECT * FROM testimonials WHERE id = ?", [$tid]);
        jsonResponse(['success' => true, 'message' => 'Testimonial created.', 'testimonial' => $item], 201);
        break;

    case 'PUT':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        if (!$existing) jsonError('Testimonial not found.', 404);
        $input = getJsonInput();
        $data = [];
        foreach (['customer_name', 'customer_title', 'rating', 'message', 'status'] as $f) {
            if (array_key_exists($f, $input)) $data[$f] = $input[$f];
        }
        if (!empty($data)) $db->update('testimonials', $data, 'id = ?', [$id]);
        $item = $db->fetchOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        jsonResponse(['success' => true, 'message' => 'Testimonial updated.', 'testimonial' => $item]);
        break;

    case 'DELETE':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM testimonials WHERE id = ?", [$id]);
        if (!$existing) jsonError('Testimonial not found.', 404);
        $db->delete('testimonials', 'id = ?', [$id]);
        jsonResponse(['success' => true, 'message' => 'Testimonial deleted.']);
        break;

    default:
        jsonError('Method not allowed', 405);
}
