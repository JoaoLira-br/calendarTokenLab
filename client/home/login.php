<?php
include './../../path.php';
include './includes/sessions.php';
require SERVER_ROOT . '/db_connection.php';
require PROJECT_ROOT . '/errorHandler.php';

if ($logged_in) {                              // If already logged in
    header('Location: account.php');           // Redirect to account page
    exit;                                      // Stop further code running
}

$user = ['name' => '',
    'email' => '',
    'password' => ''
];

$errors = [
    'email' => '',
    'password' => ''
];






/**
 * Creates an array of validation filters,
 *
 * @return array of keys email and password for validation filters
 */
function createValidationFilters(): array {
    $validation_filters = [];

    $validation_filters['email']['filter'] = FILTER_VALIDATE_EMAIL;

    $validation_filters['password']['filter'] = FILTER_VALIDATE_REGEXP;
    $validation_filters['password']['options']['regexp'] =
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
    $errors['email'] = $user['email'] ? '' : 'Must follow email formatting';
    $errors['password'] = $user['password'] ? '' : 'Password must have at least 8 characters, one lowercase and uppercase letter, and a number';
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
function checkDatabase(array $sanitizedUser): bool
{
    global $pdo;
    //check if user is already in users table
    $sql = 'SELECT * FROM users WHERE Email = :Email';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['Email' => $sanitizedUser['email']]);
    $user = $stmt->fetch();
    var_error_log($user);
    var_error_log();
    if ($user && password_verify($sanitizedUser['password'], $user['Password'])) {
        return true;
    } else {
        echo 'Please verify that your email or password are correct';

    }
return false;
}


//TODO: GET or POST? get is leading to NULL values
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    //Validation filters
    $validation_filters = createValidationFilters();

    $user = filter_input_array(INPUT_POST, $validation_filters);

    $errors = createErrorMessages($user);

    $invalid = implode($errors);

    if ($invalid) {

        $message = 'Please correct the following errors:';
        echo $message;
        var_dump($errors);
    } else {
        $message = 'Your data was valid!';
        $sanitizedUser = createSanitizedUsed($user);
        if(checkDatabase($sanitizedUser)){
            login();
            header('Location: index.php');
        }else {
            header('Location: login.php') ;
        }
        checkDatabase($sanitizedUser) ? header('Location: index.php') : header('Location: login.php') ;


    }
}

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Forma de Login</title>
    <link rel="stylesheet" href="./../css/styles.css" />
  </head>
  <body id="body-login">
    <main>
      <div class="wrapper">
        <h1>Login</h1>
        <div class="div-formLogin">
<!-- TODO: form not redirecting           -->
          <form action="./login.php" method="POST">
            <input
              type="email"
              name="email"
              id="input-email"
              placeholder="Email"
              required
            /><br /><br />

            <input
              type="password"
              name="password"
              id="input-password"
              placeholder="Senha"
              required
            /><br /><br />

            <input id="submit" type="submit" value="LOGIN" />
              <br /><br />
              <a href="signup.php">Don`t have an account yet?</a>

          </form>
        </div>
      </div>
    </main>
    <footer>



    </footer>

  </body>
</html>
