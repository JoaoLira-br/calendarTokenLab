
<?php 
$user = ['name' => '',
         'email' => '',
         'password' => ''
];
$errors = ['name' => '',
           'email' => '',
           'password' => ''
];
$message = '';
$redirectToPage = '';

if($_SERVER['REQUEST_METHOD'] == 'POST'){
  //Validation filters
  //Would need to check if there is a name or email in the server already
  $validation_filters['name']['filter'] = FILTER_VALIDATE_REGEXP;
  $validation_filters['name']['options']['regexp'] = '/^[A-z0-9]{2,10}$/';
  $validation_filters['email']['filter'] = FILTER_VALIDATE_EMAIL;

  $validation_filters['password']['filter'] = FILTER_VALIDATE_REGEXP;
  $validation_filters['password']['options']['regexp'] = 
  '/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,}$/';

  $user = filter_input_array(INPUT_POST, $validation_filters);

  $errors['name'] = $user['name'] ? '' : 'Username must be between 2 to 10 characters';
  $errors['email'] = $user['email'] ? '' : 'Must follow email formatting';
  $errors['password'] = $user['password'] ? '' : 'Password must have at least 8 characters, one lowercase and uppercase letter, and a number';
  $invalid = implode($errors);

  if($invalid){
    $message = 'Please correct the following errors:';
    $redirectToPage = 'signup.php';
  } else {
    $message = 'Your data was valid!';
    $redirectToPage = 'index.php';
    //TODO: here redirectToPage users
  }

  $user['name'] = filter_var($user['name'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  $user['email'] = filter_var($user['email'], FILTER_SANITIZE_EMAIL);
  $user['password'] = filter_var($user['password'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);


}

?>

<!DOCTYPE html>


<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./../css/styles.css" />
    <title>Signup</title>
  </head>
  <body>
   
    <div class="container">
      <div class="wrapper-signup">
        <h1>Signup</h1>
        <?= $message ?>
        <form action="<?php $redirectToPage ?>" method="POST">
          <div class="div-name">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" />
            <span class="error"><?= $errors['name'] ?></span>
          </div>
          <div class="div-email">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" />
            <span class="error"><?= $errors['email']?></span>
          </div>
          <div class="div-password">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" />
            <span class="error"><?= $errors['password']?></span>
          </div>
          <div class="div-password-confirmation">
            <label for="password-confirmation">Password Confirm</label>
            <input
              type="password"
              id="password-confirmation"
              name="password-confirmation"
            />
          </div>
          <div class="div-submit">
            <button id="btn-sign-up">Sign Up</button>
          </div>
        </form>
      </div>
      
    </div>
  </body>
</html>
