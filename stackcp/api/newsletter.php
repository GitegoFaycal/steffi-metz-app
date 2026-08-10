<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';
corsHeaders();

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        if (isset($_GET['keyword'])) {
            $kw = '%' . $_GET['keyword'] . '%';
            $subscribers = $db->fetchAll(
                "SELECT * FROM newsletters WHERE email LIKE ? ORDER BY id DESC",
                [$kw]
            );
            jsonResponse(['success' => true, 'newsletters' => $subscribers]);
        } else {
            $subscribers = $db->fetchAll("SELECT * FROM newsletters ORDER BY id DESC");
            jsonResponse(['success' => true, 'newsletters' => $subscribers]);
        }
        break;

    case 'POST':
        $input = getJsonInput();
        $email = $input['email'] ?? '';
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonError('A valid email is required.', 400);
        }
        $existing = $db->fetchOne("SELECT * FROM newsletters WHERE email = ?", [$email]);
        if ($existing) {
            jsonError('This email is already subscribed.', 400);
        }
        $subId = $db->insert('newsletters', ['email' => $email]);
        $subscriber = $db->fetchOne("SELECT * FROM newsletters WHERE id = ?", [$subId]);
        jsonResponse([
            'success' => true,
            'message' => 'Newsletter subscription successful.',
            'subscriber' => $subscriber
        ], 201);
        break;

    case 'DELETE':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM newsletters WHERE id = ?", [$id]);
        if (!$existing) jsonError('Newsletter subscriber not found.', 404);
        $db->delete('newsletters', 'id = ?', [$id]);
        jsonResponse(['success' => true, 'message' => 'Newsletter subscriber deleted successfully.']);
        break;

    default:
        jsonError('Method not allowed', 405);
}
