<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';
corsHeaders();

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $row = $db->fetchOne("SELECT * FROM about ORDER BY id ASC LIMIT 1");
        if (!$row) jsonError('About not found.', 404);
        jsonResponse(['success' => true, 'about' => $row]);
        break;

    case 'PUT':
        $input = getJsonInput();
        $existing = $db->fetchOne("SELECT * FROM about ORDER BY id ASC LIMIT 1");
        $fields = ['eyebrow', 'title', 'description', 'quote', 'image_one', 'image_two'];
        $data = [];
        foreach ($fields as $f) {
            if (array_key_exists($f, $input)) $data[$f] = $input[$f];
        }
        if ($existing) {
            if (!empty($data)) $db->update('about', $data, 'id = ?', [$existing['id']]);
            $code = 200;
        } else {
            $db->insert('about', array_merge(['eyebrow' => '', 'title' => ''], $data));
            $code = 201;
        }
        $row = $db->fetchOne("SELECT * FROM about ORDER BY id ASC LIMIT 1");
        jsonResponse(['success' => true, 'about' => $row], $code);
        break;

    default:
        jsonError('Method not allowed', 405);
}
