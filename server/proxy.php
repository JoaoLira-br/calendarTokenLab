<?php
// Include the database connection file (adjust path as needed)
require 'db_connection.php';

// Check what type of request is being made
$action = $_POST['action'] ?? '';  // You can also use $_GET based on your needs


$response = [];

switch ($action) {
    case 'fetch_id':

    case 'fetch_events':
        // Example: Fetching events from the `user_events` table
        $stmt = $pdo->prepare("SELECT * FROM user_events WHERE User_id = :user_id");
        $stmt->execute([':user_id' => $_POST['user_id']]);
        $events = $stmt->fetchAll();
        $response['events'] = $events;
        break;
    case 'fetch_user':
        // Example: Fetching a user from the `users` table
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :user_id");
        $stmt->execute([':user_id' => $_POST['user_id']]);
        $user = $stmt->fetch();
        $response['user'] = $user;
        break;
    // Add more cases here for other actions, like creating, updating, or deleting events
    case 'create_event':
        // Example: Creating an event in the `user_events` table
        $stmt = $pdo->prepare("INSERT INTO user_events (User_id, Title, Description, Start, End) VALUES (:user_id, :title, :description, :start, :end)");
        $stmt->execute([
            ':user_id' => $_POST['user_id'],
            ':title' => $_POST['title'],
            ':description' => $_POST['description'],
            ':start' => $_POST['start'],
            ':end' => $_POST['end'],
        ]);
        $response['success'] = 'Event created successfully.';
        break;
case 'update_event':
        // Example: Updating an event in the `user_events` table
        $stmt = $pdo->prepare("UPDATE user_events SET Title = :title, Description = :description, Start = :start, End = :end WHERE id = :id");
        $stmt->execute([
            ':id' => $_POST['id'],
            ':title' => $_POST['title'],
            ':description' => $_POST['description'],
            ':start' => $_POST['start'],
            ':end' => $_POST['end'],
        ]);
        $response['success'] = 'Event updated successfully.';
        break;
    case 'delete_event':
        // Example: Deleting an event from the `user_events` table
        $stmt = $pdo->prepare("DELETE FROM user_events WHERE id = :id");
        $stmt->execute([':id' => $_POST['id']]);
        $response['success'] = 'Event deleted successfully.';
        break;

    default:
        $response['error'] = "Invalid action specified.";

}

// Return the JSON response
echo json_encode($response);
?>
