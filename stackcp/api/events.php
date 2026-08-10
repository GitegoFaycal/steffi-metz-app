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
            $event = $db->fetchOne("SELECT * FROM events WHERE id = ?", [$id]);
            if (!$event) jsonError('Event not found.', 404);
            jsonResponse(['success' => true, 'event' => $event]);
        } elseif (isset($_GET['keyword'])) {
            $kw = '%' . $_GET['keyword'] . '%';
            $events = $db->fetchAll(
                "SELECT * FROM events WHERE title LIKE ? OR price LIKE ? OR badge LIKE ? OR description LIKE ? ORDER BY id DESC",
                [$kw, $kw, $kw, $kw]
            );
            jsonResponse(['success' => true, 'events' => $events]);
        } else {
            $events = $db->fetchAll(
                "SELECT * FROM events ORDER BY id DESC"
            );
            jsonResponse(['success' => true, 'events' => $events]);
        }
        break;

    case 'POST':
        $input = getJsonInput();
        $eventId = $db->insert('events', [
            'title' => $input['title'] ?? '',
            'price' => $input['price'] ?? null,
            'badge' => $input['badge'] ?? null,
            'description' => $input['description'] ?? null,
            'image' => $input['image'] ?? null,
            'status' => $input['status'] ?? 'active',
        ]);
        $event = $db->fetchOne("SELECT * FROM events WHERE id = ?", [$eventId]);
        jsonResponse(['success' => true, 'message' => 'Event created successfully.', 'event' => $event], 201);
        break;

    case 'PUT':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM events WHERE id = ?", [$id]);
        if (!$existing) jsonError('Event not found.', 404);
        $input = getJsonInput();
        $data = [];
        $fields = ['title', 'price', 'badge', 'description', 'image', 'status'];
        foreach ($fields as $f) {
            if (array_key_exists($f, $input)) {
                $data[$f] = $input[$f];
            }
        }
        if (!empty($data)) {
            $db->update('events', $data, 'id = ?', [$id]);
        }
        $event = $db->fetchOne("SELECT * FROM events WHERE id = ?", [$id]);
        jsonResponse(['success' => true, 'message' => 'Event updated successfully.', 'event' => $event]);
        break;

    case 'DELETE':
        if (!$id) jsonError('ID required');
        $existing = $db->fetchOne("SELECT * FROM events WHERE id = ?", [$id]);
        if (!$existing) jsonError('Event not found.', 404);
        $db->delete('events', 'id = ?', [$id]);
        jsonResponse(['success' => true, 'message' => 'Event deleted successfully.']);
        break;

    default:
        jsonError('Method not allowed', 405);
}
