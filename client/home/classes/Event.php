<?php


class Event {
    public string $title;
    public string $description;
    public string $start;
    public string $end;

    function __construct(string $title,
    string $description,
    string $start,
    string $end){
        $this -> title = $title;
        $this -> description = $description;
        $this -> start = $start;
        $this -> end = $end;
    }
}


?>