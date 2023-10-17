<?php
session_start();                                         // Start/renew session
$logged_in = $_SESSION['logged_in'] ?? false;
/** @var TYPE_NAME $user_id */
$user_id = $_SESSION['user_id'] ?? null;

function user_login($user_id)                                         // Remember user passed login
{

    session_regenerate_id(true);                         // Update session id
    $_SESSION['logged_in'] = true;
    $_SESSION['user_id'] = $user_id;
}

function user_logout()                                        // Terminate the session
{
    $_SESSION = [];                                      // Clear contents of array

    $params = session_get_cookie_params();               // Get session cookie parameters
    setcookie('PHPSESSID', '', time() - 3600, $params['path'], $params['domain'],
        $params['secure'], $params['httponly']);         // Delete session cookie

    session_destroy();                                   // Delete session file
}

function require_user_login($logged_in)                       // Check if user logged in
{
    if ($logged_in == false) {                           // If not logged in
        header('Location: login.php');                   // Send to login page
        exit;                                            // Stop rest of page running
    }
}