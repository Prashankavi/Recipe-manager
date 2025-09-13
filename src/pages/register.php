<?php
// src/pages/register.php
header("Content-Type: application/json");
include 'db.php';

try {
    // Get JSON input
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data || !isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
        throw new Exception("Name, email, and password are required");
    }

    $name = trim($data['name']);
    $email = trim($data['email']);
    $password = $data['password'];

    // Validation
    if (empty($name)) {
        throw new Exception("Name cannot be empty");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    if (strlen($password) < 6) {
        throw new Exception("Password must be at least 6 characters long");
    }

    // Check if email already exists
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    if (!$check) {
        throw new Exception("Database error: " . $conn->error);
    }

    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        throw new Exception("Email is already registered");
    }

    // Hash password and insert user
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())");
    if (!$stmt) {
        throw new Exception("Database error: " . $conn->error);
    }

    $stmt->bind_param("sss", $name, $email, $hashedPassword);

    if ($stmt->execute()) {
        $userId = $conn->insert_id;
        
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $userId,
                "name" => $name,
                "email" => $email
            ]
        ]);
    } else {
        throw new Exception("Failed to create account: " . $stmt->error);
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

$conn->close();
?>