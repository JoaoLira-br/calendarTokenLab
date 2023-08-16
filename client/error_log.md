7/31/23

# include files making browser not display php file 

In /client/home/signup.php 

## Solution: did not realize double dependecy was causing issue

- as in User.php had `include 'classes/Calendar.php';` and Calendar.php had `include 'classes/User.php`. It would enter in an infinite recursion of trying to fetch each others` file I suppose.

- I assumed it was a Path issue when it was double dependecy issue

## new issue: how to include user in calendar? maybe just use unique user_id that points to user?

08/04/23

# Syntax errors, program outline and class implementations not being displayed

- Did not know extension about PHP intelliphense. once installed solved these issues. 