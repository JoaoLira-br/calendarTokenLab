<?php 
include 'classes/User.php';

class Calendar {
    public int $user_id;
    public array $events;

    function __construct(int $user_id,
    array $events){
        $this -> user_id = $user_id;
        $this -> events = $events;
    }
}
?>