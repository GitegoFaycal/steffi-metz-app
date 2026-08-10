<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';
corsHeaders();

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $row = $db->fetchOne("SELECT * FROM settings ORDER BY id ASC LIMIT 1");
        if (!$row) jsonError('Website settings not found.', 404);
        jsonResponse(['success' => true, 'settings' => $row]);
        break;

    case 'PUT':
        $input = getJsonInput();
        $existing = $db->fetchOne("SELECT * FROM settings ORDER BY id ASC LIMIT 1");

        $fields = [
            'site_name', 'whatsapp_number', 'email', 'address',
            'instagram', 'facebook', 'tiktok',
            'catalogue_title', 'catalogue_description',
            'newsletter_title', 'newsletter_description',
            'shop_title', 'opening_hours',
            'footer_description',
            'community_eyebrow', 'community_title', 'community_description',
            'community_button_text', 'community_whatsapp_message'
        ];

        $data = [];
        foreach ($fields as $f) {
            if (array_key_exists($f, $input)) {
                $data[$f] = $input[$f];
            }
        }

        if ($existing) {
            if (!empty($data)) {
                $db->update('settings', $data, 'id = ?', [$existing['id']]);
            }
            $code = 200;
        } else {
            $insertData = array_merge([
                'site_name' => 'Steffi Metz',
            ], $data);
            $db->insert('settings', $insertData);
            $code = 201;
        }

        $updated = $db->fetchOne("SELECT * FROM settings ORDER BY id ASC LIMIT 1");
        jsonResponse(['success' => true, 'settings' => $updated], $code);
        break;

    default:
        jsonError('Method not allowed', 405);
}
