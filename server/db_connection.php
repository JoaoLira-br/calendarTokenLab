<?php
$message = '';
$redirectToPage = '';
$type = 'mysql';
$server = 'localhost';
$db = 'calendar_token_lab';
$port = '3306';
$charset = 'utf8mb4';
$dsn = "$type:host=$server;dbname=$db;port=$port;charset=$charset";
$username = 'root';
$password = '';
$options = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false
];
$pdo = null;
try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    echo $e->getMessage();
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
