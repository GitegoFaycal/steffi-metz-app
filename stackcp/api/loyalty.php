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
            $tier = $db->fetchOne("SELECT * FROM loyalty_tiers WHERE id = ?", [$id]);
            if (!$tier) jsonError('Loyalty tier not found.', 404);
            jsonResponse(['success' => true, 'tier' => $tier]);
        } else {
            $statusFilter = isset($_GET['all']) ? '' : "WHERE status = 'active'";
            $tiers = $db->fetchAll("SELECT * FROM loyalty_tiers $statusFilter ORDER BY sort_order ASC, id ASC");
            jsonResponse(['success' => true, 'tiers' => $tiers]);
        }
        break;

    case 'POST':
        $input = getJsonInput();
        $tierId = $db->insert('loyalty_tiers', [
            'icon' => $input['icon'] ?? '',
            'name' => $input['name'] ?? '',
            'monthly_spend' => $input['monthly_spend'] ?? null,
            'discount' => $input['discount'] ?? null,
            'benefits' => $input['benefits'] ?? null,
            'sort_order' => $input['sort_order'] ?? 0,
            'status' => $input['status'] ?? 'active',
        ]);
        $tier = $db->fetchOne("SELECT * FROM loyalty_tiers WHERE id = ?", [$tierId]);
        jsonResponse(['success' => true, 'message' => 'Loyalty tier created successfully.', 'tier' => $tier], 201);
        break;

    case 'PUT':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM loyalty_tiers WHERE id = ?", [$id]);
        if (!$existing) jsonError('Loyalty tier not found.', 404);
        $input = getJsonInput();
        $data = [];
        $fields = ['icon', 'name', 'monthly_spend', 'discount', 'benefits', 'sort_order', 'status'];
        foreach ($fields as $f) {
            if (array_key_exists($f, $input)) {
                $data[$f] = $input[$f];
            }
        }
        if (!empty($data)) {
            $db->update('loyalty_tiers', $data, 'id = ?', [$id]);
        }
        $tier = $db->fetchOne("SELECT * FROM loyalty_tiers WHERE id = ?", [$id]);
        jsonResponse(['success' => true, 'message' => 'Loyalty tier updated successfully.', 'tier' => $tier]);
        break;

    case 'DELETE':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM loyalty_tiers WHERE id = ?", [$id]);
        if (!$existing) jsonError('Loyalty tier not found.', 404);
        $db->delete('loyalty_tiers', 'id = ?', [$id]);
        jsonResponse(['success' => true, 'message' => 'Loyalty tier deleted successfully.']);
        break;

    default:
        jsonError('Method not allowed', 405);
}
