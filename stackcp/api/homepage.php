<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';
corsHeaders();

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $row = $db->fetchOne("SELECT * FROM homepage ORDER BY id ASC LIMIT 1");
        if (!$row) jsonError('Homepage not found.', 404);
        jsonResponse(['success' => true, 'homepage' => $row]);
        break;

    case 'PUT':
        $input = getJsonInput();
        $existing = $db->fetchOne("SELECT * FROM homepage ORDER BY id ASC LIMIT 1");
        $fields = ['location_text', 'hero_title', 'hero_highlight', 'hero_description', 'button_one_text', 'button_two_text', 'hero_image'];
        $data = [];
        foreach ($fields as $f) {
            if (array_key_exists($f, $input)) {
                $data[$f] = $input[$f];
            }
        }
        if ($existing) {
            if (!empty($data)) $db->update('homepage', $data, 'id = ?', [$existing['id']]);
            $code = 200;
        } else {
            $db->insert('homepage', array_merge(['location_text' => '', 'hero_title' => ''], $data));
            $code = 201;
        }
        $row = $db->fetchOne("SELECT * FROM homepage ORDER BY id ASC LIMIT 1");
        jsonResponse(['success' => true, 'homepage' => $row], $code);
        break;

    default:
        jsonError('Method not allowed', 405);
}
