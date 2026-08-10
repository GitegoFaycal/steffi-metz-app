<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';
corsHeaders();

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        $messages = $db->fetchAll("SELECT * FROM contact_messages ORDER BY id DESC");
        jsonResponse(['success' => true, 'contactMessages' => $messages]);
        break;

    case 'POST':
        $input = getJsonInput();
        $cid = $db->insert('contact_messages', [
            'name' => $input['name'] ?? '',
            'email' => $input['email'] ?? '',
            'phone' => $input['phone'] ?? null,
            'subject' => $input['subject'] ?? null,
            'message' => $input['message'] ?? '',
        ]);
        $msg = $db->fetchOne("SELECT * FROM contact_messages WHERE id = ?", [$cid]);
        jsonResponse(['success' => true, 'message' => 'Message sent.', 'contactMessage' => $msg], 201);
        break;

    case 'PUT':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM contact_messages WHERE id = ?", [$id]);
        if (!$existing) jsonError('Message not found.', 404);
        $db->update('contact_messages', ['is_read' => 1], 'id = ?', [$id]);
        $msg = $db->fetchOne("SELECT * FROM contact_messages WHERE id = ?", [$id]);
        jsonResponse(['success' => true, 'contactMessage' => $msg]);
        break;

    case 'DELETE':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM contact_messages WHERE id = ?", [$id]);
        if (!$existing) jsonError('Message not found.', 404);
        $db->delete('contact_messages', 'id = ?', [$id]);
        jsonResponse(['success' => true, 'message' => 'Message deleted.']);
        break;

    default:
        jsonError('Method not allowed', 405);
}
