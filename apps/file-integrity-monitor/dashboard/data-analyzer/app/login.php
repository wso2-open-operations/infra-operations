<?php
ob_start();
session_start();

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
   // $username = getenv('DASH_USER') ?: '';
  //  $password = getenv('DASH_PASS') ?: ''; 1.
    $username = getenv('DASH_USER');
    $password = getenv('DASH_PASS');

    $inputUser = $_POST["username"] ?? '';
    $inputPass = $_POST["password"] ?? '';

    if ($username === false || $password === false || $username === '' || $password === '') {
        $error = "Login is not configured.";
    // Check the input
    //if ($_POST["username"] === $username && $_POST["password"] === $password) { 2.
    } elseif ($inputUser === $username && $inputPass === $password) {
        $_SESSION["loggedin"] = true;
        header("Location: dashboard.php");
        exit;
    } else {
        $error = "Invalid username or password.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #fff;
            color: #333;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f7f7f7;
        }

        .login-container {
            background-color: #fff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 300px;
        }

        h1 {
            text-align: center;
            color: #ff7f00; /* Orange color */
            margin-bottom: 20px;
            font-size: 24px;
        }

        h2 {
            text-align: center;
            color: #333;
            font-size: 18px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #333;
        }

        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }

        .form-group input[type="submit"] {
            background-color: #ff7f00; /* Orange color */
            color: #fff;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }

        .form-group input[type="submit"]:hover {
            background-color: #e66a00;
        }

        .error-message {
            color: red;
            font-size: 14px;
            text-align: center;
            margin-bottom: 20px;
        }

        .powered-by {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #333;
        }

        .powered-by a {
            color: #ff7f00; /* Orange color */
            text-decoration: none;
        }

        .powered-by a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <div class="login-container">
        <h1>WSO2 - FIM</h1>
        <h2>Login</h2>

        <?php if (isset($error)) { echo "<p class='error-message'>$error</p>"; } ?>

        <form method="post" action="login.php">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="form-group">
                <input type="submit" value="Login">
            </div>
        </form>

        <div class="powered-by">
            <p>Powered by <a href="https://www.digiops.com" target="_blank">DigiOps</a></p>
        </div>
    </div>

</body>
</html>
