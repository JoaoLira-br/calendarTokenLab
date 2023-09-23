<?php
declare(strict_types=1);
$errors = ["errno" => "", "errstr" => "", "errfile" => "", "errline" => ""];

error_reporting(E_ALL);
ini_set("display_errors", 0);
function standardErrorHandler($errno, $errstr, $errfile, $errline): void
{
    $message =  "Error: [$errno] $errstr - $errfile:$errline";
    error_log($message . PHP_EOL, 3, "error_log.txt");

}
function jsonErrorHandler($errno, $errstr, $errfile, $errline){
    $errors["errno"] = $errno;
    $errors["errstr"] = $errstr;
    $errors["errfile"] = $errfile;
    $errors["errline"] = $errline;
    json_encode($errors);
    error_log(json_encode($errors), 3, "error_log.txt");

}

set_error_handler("jsonErrorHandler");

