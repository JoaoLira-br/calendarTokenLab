<?php
include 'classes/Calendar.php';
class User {
    public string $username;
    public string $email;
    private string $password;
    public int user_id
    public Calendar $calendar;

    public function __construct(
        string $username, 
        string $email,
        string $password,
        Calendar $calendar){
            $this -> username = $username;
            $this -> email = $email;
            $this -> password = $password;
            //todo: set user`s id to get user id count from server and increment it
            $this -> calendar = $calendar;
            
                           }
    
    
}


?>