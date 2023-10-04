<?php
declare(strict_types=1);

include 'Calendar.php';
class User {
    public string $username;
    public string $email;
    private string $password;
    private int $user_id;
    public Calendar $calendar;

    public function __construct(string $username, string $email, string $password, int $user_id=null, Calendar $calendar=null){
        $this -> username = $username;
        $this -> email = $email;
        $this -> password = $password;
        //todo: set user`s id to get user id count from server and increment it
        $this -> user_id = $user_id;
        $this -> calendar = $calendar;


    }

    /**
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * @param string $username
     */
    public function setUsername(string $username): void
    {
        $this->username = $username;
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * @param string $password
     */
    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

    /**
     * @return int
     */
    public function getUserId(): int
    {
        return $this->user_id;
    }

    /**
     * @param int $user_id
     */
    public function setUserId(int $user_id): void
    {
        $this->user_id = $user_id;
    }

    /**
     * @return Calendar
     */
    public function getCalendar(): Calendar
    {
        return $this->calendar;
    }

    /**
     * @param Calendar $calendar
     */
    public function setCalendar(Calendar $calendar): void
    {
        $this->calendar = $calendar;
    }



    
    
}


?>