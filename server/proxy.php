<?php
// Include the database connection file (adjust path as needed)
require 'db_connection.php';

// Check what type of request is being made
$action = $_POST['action'] ?? '';  // You can also use $_GET based on your needs

$response = [];

switch ($action) {
    case 'fetch_events':
        // Example: Fetching events from the `user_events` table
        $stmt = $pdo->prepare("SELECT * FROM user_events WHERE User_id = :user_id");
        $stmt->execute([':user_id' => $_POST['user_id']]);
        $events = $stmt->fetchAll();
        $response['events'] = $events;
        break;

    // Add more cases here for other actions, like creating, updating, or deleting events

    default:
        $response['error'] = "Invalid action specified.";
}

// Return the JSON response
echo json_encode($response);
?>
