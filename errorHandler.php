<?php
declare(strict_types=1);
$errors = ["errno" => "", "errstr" => "", "errfile" => "", "errline" => ""];

error_reporting(E_ALL);
ini_set("display_errors", "0");
/*
 * log echo to error_log.txt
 */

function standardErrorHandler($errno, $errstr, $errfile, $errline): void
{
    $message =  "Error: [$errno] $errstr - $errfile:$errline";
    error_log($message . PHP_EOL, 3, "error_log.txt");

}
function jsonErrorHandler($errno, $errstr, $errfile, $errline) : void{
    $errors["errno"] = $errno;
    $errors["errstr"] = $errstr;
    $errors["errfile"] = $errfile;
    $errors["errline"] = $errline;
    error_log(json_encode($errors, JSON_PRETTY_PRINT) . PHP_EOL, 3, "error_log.txt");

}

function var_error_log( $object=null ) : void{
    ob_start();                    // start buffer capture
    var_dump( $object );           // dump the values
    $contents = ob_get_contents(); // put the buffer into a variable
    ob_end_clean();                // end capture
    error_log( $contents . PHP_EOL, 3, "error_log.txt");        // log contents of the result of var_dump( $object )
}



set_error_handler("jsonErrorHandler");

