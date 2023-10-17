
<?php
include './../../path.php';
include './includes/calendar_sessions.php';
require SERVER_ROOT . '/db_connection.php';
require PROJECT_ROOT . '/errorHandler.php';


$user = ['name' => '',
         'email' => '',
         'password' => '',
            'password-confirmation' => ''
];
$errors = ['name' => '',
           'email' => '',
           'password' => '',
            'password-confirmation' => ''
];








/**
 * Creates an array of validation filters, including filters for name, email, and password
 * @return array of validation filters
 */
function createValidationFilters(): array {
    $validation_filters = [];
    //todo: Would need to check if there is a name or email in the server already
    $validation_filters['name']['filter'] = FILTER_VALIDATE_REGEXP;
    $validation_filters['name']['options']['regexp'] = '/^[A-z0-9]{2,10}$/';

    $validation_filters['email']['filter'] = FILTER_VALIDATE_EMAIL;

    $validation_filters['password']['filter'] = FILTER_VALIDATE_REGEXP;
    $validation_filters['password']['options']['regexp'] =
        '/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,}$/';
    $validation_filters['password-confirmation']['filter'] = FILTER_VALIDATE_REGEXP;
    $validation_filters['password-confirmation']['options']['regexp'] =
        '/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]{8,}$/';


    return $validation_filters;
}

/**
 * Creates an array of errors for name, email, and password
 * @param $user array of pre-validated user data
 * @return array of errors
 */
function createErrorMessages(array $user): array
{
    $errors['name'] = $user['name'] ? '' : 'Username must be between 2 to 10 characters';
    $errors['email'] = $user['email'] ? '' : 'Must follow email formatting';
    $errors['password'] = $user['password'] ? '' : 'Password must have at least 8 characters, one lowercase and uppercase letter, and a number';
    $errors['password-confirmation'] = $user['password'] === $user['password-confirmation'] ? '' : 'Passwords do not match';
    return $errors;
}

/**
 * Creates an array of sanitized user data for security purposes
 * @param $user array of pre-validated user data
 * @return array of sanitized user data
 */
function createSanitizedUsed(array $user): array
{
    $sanitizedUser['name'] = filter_var($user['name'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $sanitizedUser['email'] = filter_var($user['email'], FILTER_SANITIZE_EMAIL);
    $sanitizedUser['password'] = filter_var($user['password'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    return $sanitizedUser;
}

/*
 * Sends the sanitized user data to the database
 * @param $sanitizedUser array of sanitized user data
 * @return void
 */
function sendToDatabase(array $sanitizedUser): int
{
    //check if user is already in users table\
    global $pdo, $user_id;

    $sql = 'SELECT * FROM users WHERE Username = :Username';

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['Username' => $sanitizedUser['name']]);
    $db_user = $stmt->fetch();
    var_obj_log($db_user);


    if ($db_user) {
        $errors['name'] = 'User with name' . $db_user['Username'] . 'already exists';
        return false;
    } else {
        $sanitizedUser['password'] = password_hash($sanitizedUser['password'], PASSWORD_DEFAULT);
        $sql = 'INSERT INTO users (Username, Email, Password) VALUES (:name, :email, :password)';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($sanitizedUser);
        $user_id = $pdo->lastInsertId();
        return true;
    }
}

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    echo '<pre> POST </pre>';
    //Validation filters
    $validation_filters = createValidationFilters();


    $user = filter_input_array(INPUT_POST, $validation_filters);
    var_obj_log($user);
    $errors = createErrorMessages($user);

    $invalid = implode($errors);

    if ($invalid) {
        $message = 'Please correct the following errors:';
        $redirectToPage = 'signup.php';
    } else {
        $message = 'Your data was valid!';
        $sanitizedUser = createSanitizedUsed($user);
        if(sendToDatabase($sanitizedUser, $pdo, $user_id)){

            user_login($user_id);
            header('Location: index.php');
        };
        error_log('User was not sent to database');

//        if(sendToDatabase($sanitizedUser)){
//            login();
//            header('Location: index.php');
//        }else
//        $sanitizedUser = createSanitizedUsed($user);
//        checkDatabase($sanitizedUser);
    }
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
        <form action="./signup.php" method="POST">
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
              <span class="error"><?= $errors['password-confirmation'] ?></span>
          </div>
          <div class="div-submit">
            <button id="btn-sign-up">Sign Up</button>
              <br /><br />
              <a href="login.php">Already Have an account?</a>

          </div>
        </form>
      </div>
      
    </div>
  </body>
</html>
