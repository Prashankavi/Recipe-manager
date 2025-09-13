<?php
// src/pages/login.php
header("Content-Type: application/json");
include 'db.php';

try {
    // Get JSON input
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data || !isset($data['email']) || !isset($data['password'])) {
        throw new Exception("Email and password are required");
    }

    $email = trim($data['email']);
    $password = $data['password'];

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    // Prepare and execute query
    $stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
    if (!$stmt) {
        throw new Exception("Database error: " . $conn->error);
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        // Verify password
        if (password_verify($password, $row['password'])) {
            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => (int)$row['id'],
                    "name" => $row['name'],
                    "email" => $row['email']
                ]
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "error" => "Invalid email or password"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "error" => "Invalid email or password"
        ]);
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

