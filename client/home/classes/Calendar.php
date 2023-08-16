<?php 


class Calendar {
    public int $user_id;
    public array $events; //? is array the correct data type?

    function __construct(int $user_id,
    array $events){
        $this -> user_id = $user_id;
        $this -> events = $events;
    }
}
?>