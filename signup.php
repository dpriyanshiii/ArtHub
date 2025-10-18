<?php
// signup.php
session_start();
require_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $fullname = trim($_POST['fullname']);
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    
    // Basic validation
    $errors = [];
    
    if (empty($fullname)) {
        $errors[] = "Full name is required";
    }
    
    if (empty($username)) {
        $errors[] = "Username is required";
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Valid email is required";
    }
    
    if (strlen($password) < 6) {
        $errors[] = "Password must be at least 6 characters";
    }
    
    // If no errors, proceed with registration
    if (empty($errors)) {
        try {
            // Check if username or email already exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $email]);
            
            if ($stmt->rowCount() > 0) {
                $errors[] = "Username or email already exists";
            } else {
                // Hash password
                $password_hash = password_hash($password, PASSWORD_DEFAULT);
                
                // Insert user
                $stmt = $pdo->prepare("INSERT INTO users (fullname, username, email, password_hash) VALUES (?, ?, ?, ?)");
                $stmt->execute([$fullname, $username, $email, $password_hash]);
                
                // Store user in session
                $_SESSION['user_id'] = $pdo->lastInsertId();
                $_SESSION['username'] = $username;
                $_SESSION['fullname'] = $fullname;
                $_SESSION['email'] = $email;
                
                // Redirect to success page
                header('Location: success.html');
                exit();
            }
        } catch(PDOException $e) {
            $errors[] = "Registration failed: " . $e->getMessage();
        }
    }
    
    // If there are errors, show them
    if (!empty($errors)) {
        echo "<h2>Registration Errors:</h2>";
        foreach ($errors as $error) {
            echo "<p style='color: red;'>$error</p>";
        }
        echo "<a href='registration.php'>Go back</a>";
    }
} else {
    header('Location: registration.php');
    exit();
}
?>