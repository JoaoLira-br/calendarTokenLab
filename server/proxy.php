<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include the database connection file (adjust path as needed)
include './../path.php';
require 'db_connection.php';
require PROJECT_ROOT . '/client/home/includes/calendar_sessions.php';

include PROJECT_ROOT . '/errorHandler.php';

header('Content-Type: application/json');

// Check what type of request is being made
$action = $_POST['action'] ?? '';  // You can also use $_GET based on your needs


$response = [];

function convertDateToMySQLFormat($dateString): ?string
{
    if($dateString == null){
        return null;
    }
    // Split the date string by "/"
    $parts = explode("/", $dateString);

    // Check if the date string is in the expected format
    if (count($parts) !== 3) {
        throw new Exception("Invalid date format. Expected MM/DD/YYYY.");
    }

    // Extract the month, day, and year
    list($month, $day, $year) = $parts;

    // Return the date in MySQL's DATE format
    return sprintf('%s-%02s-%02s', $year, $month, $day);
}

function convertMySQLFormatToDate($dateString): ?string
{
    if($dateString == null){
        return null;
    }
    // Split the date string by "-"
    $parts = explode("-", $dateString);

    // Check if the date string is in the expected format
    if (count($parts) !== 3) {
        throw new Exception("Invalid date format. Expected YYYY-MM-DD.");
    }

    // Extract the year, month, and day
    list($year, $month, $day) = $parts;

    // Return the date in MM/DD/YYYY format
    return sprintf('%02s/%02s/%s', $month, $day, $year);
}

function convertTimeToMySQLFormat($timeString): ?string
{

    // Check if the time string is null or empty
    if (empty($timeString)) {
        // You can return a default value, or null, depending on your requirements
        // For this example, I'm returning null
        return null;
    }

    // Split the time string by ":"
    $parts = explode(":", $timeString);

    // Extract the hours and minutes
    list($hours, $minutes) = $parts;

    // Return the time in MySQL's TIME format
    return sprintf('%02s:%02s:00', $hours, $minutes);
}
function convertMySQLFormatToTime($timeString): ?string
{
    // Check if the time string is null or empty
    if (empty($timeString)) {
        // You can return a default value, or null, depending on your requirements
        // For this example, I'm returning null
        return null;
    }

    // Split the time string by ":"
    $parts = explode(":", $timeString);

    // Extract the hours and minutes
    list($hours, $minutes) = $parts;

    // Return the time in HH:MM format
    return sprintf('%02s:%02s', $hours, $minutes);
}

/**
 * @throws Exception
 */
function migrateData($oldEvents): array
{
    $newEvents = [];
    foreach ($oldEvents as $event) {
        // If the date does not exist in the new structure, initialize it
        if (!isset($newEvents[$event['Date']])) {
            $newEvents[$event['Date']] = [
                'date' => convertMySQLFormatToDate($event['Date']),
                'dateEvents' => []
            ];
        }

        // Append the event to the dateEvents array for the specific date
        $newEvents[$event['Date']]['dateEvents'][] = [
            'title' => $event['Title'],
            'description' => $event['Description'],
            'start' => convertMySQLFormatToTime($event['Start_time']),
            'end' => convertMySQLFormatToTime($event['End_time']),
            'id' => $event['ID']
        ];
    }

    // Return the values of the associative array to have a list format
    return array_values($newEvents);
}



switch ($action) {
    case 'fetch_id':
        $response['user_id'] = $user_id;
        break;
    case 'fetch_events':
        // Example: Fetching events from the `user_events` table
        $stmt = $pdo->prepare("SELECT * FROM user_events WHERE User_id = :user_id ORDER BY Date ASC");
        $stmt->execute([':user_id' => $_POST['user_id']]);
        $dates = $stmt->fetchColumn();
        $events = $stmt->fetchAll();
        $response['events'] = $events;

        $stmt = $pdo->prepare("SELECT * FROM user_events WHERE User_id = :user_id ORDER BY Date ASC");
        $stmt->execute([':user_id' => $_POST['user_id']]);
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);


        try {
            $response['events'] = migrateData($events);
        } catch (Exception $e) {
        }


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
        $user_id = $_POST['user_id'];
        $event = $_POST['event'];
        $title = $event['title'];
        $description = $event['description'];
        $start = convertTimeToMySQLFormat($event['start']);
        $end = convertTimeToMySQLFormat($event['end']);
        try {
            $date = convertDateToMySQLFormat($event['date']);
        } catch (Exception $e) {
        }

//        // Example: Creating an event in the `user_events` table
        $stmt = $pdo->prepare("INSERT INTO user_events (User_id, Title, Description, Start_time, End_time, Date) VALUES (:user_id, :title, :description, :start, :end, :date)");
        $stmt->execute([
            ':user_id' => $user_id,
            ':title' => $title,
            ':description' => $description,
            ':start' => $start,
            ':end' => $end,
            ':date' => $date
        ]);

        $response['success'] = 'Event created successfully.' . $user_id . $event['title'] . $event['description'] . $event['start'] . $event['end'] . $date;
        $response['event_id'] = $pdo->lastInsertId();
        break;
case 'update_event':

        $event = $_POST['event'];
        $start = convertTimeToMySQLFormat($event['start']);
        $end = convertTimeToMySQLFormat($event['end']);
        $date = convertDateToMySQLFormat($event['date']);
        var_dump($event, $start, $end, $date, $_POST['id'] );

        // Example: Updating an event in the `user_events` table
        $stmt = $pdo->prepare("UPDATE user_events SET Title = :title, Description = :description, Start = :start, End = :end WHERE id = :id");
        $stmt->execute([
            ':title' => $event['title'],
            ':description' => $event['description'],
            ':start' => $start,
            ':end' => $end,
            ':date' => $date,
            ':id' => $_POST['id']

        ]);

        break;
    case 'delete_event':
        // Example: Deleting an event from the `user_events` table
        $stmt = $pdo->prepare("DELETE FROM user_events WHERE id = :id");
        $stmt->execute([':id' => $_POST['id']]);
        $response['success'] = 'Event deleted successfully.';
        $response['event_id'] = $_POST['id'];
        break;

    default:
        $response['error'] = "Invalid action specified.";

}

// Return the JSON response
echo json_encode($response);
?>
