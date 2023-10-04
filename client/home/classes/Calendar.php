<?php
declare(strict_types=1);
class Calendar{
    public array $events = [];

    public function __construct(array $events=null){
        $this -> events = $events;
    }

    /**
     * @return array
     */
    public function getEvents(): array
    {
        return $this->events;
    }

    /**
     * @param array $events
     */
    public function setEvents(array $events): void
    {
        $this->events = $events;
    }
}




?>