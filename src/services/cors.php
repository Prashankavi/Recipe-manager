<?php
// src/pages/cors.php - Include this at the top of all your PHP files
// Comprehensive CORS handling
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>

<?php
// src/pages/db.php (Updated with better CORS)
include 'cors.php';

$host = "localhost";
$user = "root";
$pass = "";
$db = "recipe_manager";

try {
    $conn = new mysqli($host, $user, $pass, $db);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8");
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Database connection failed: " . $e->getMessage()
    ]);
    exit();
}

// If accessed directly
if (basename($_SERVER['PHP_SELF']) === "db.php") {
    echo json_encode([
        "success" => true,
        "message" => "Database connected successfully!",
        "timestamp" => date('Y-m-d H:i:s')
    ]);
    exit();
}
?>

<?php
// src/pages/login.php (Updated)
include 'cors.php';
include 'db.php';

try {
    $input = file_get_contents("php://input");
    
    if (empty($input)) {
        throw new Exception("No data received");
    }
    
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON data");
    }

    if (!isset($data['email']) || !isset($data['password'])) {
        throw new Exception("Email and password are required");
    }

    $email = trim($data['email']);
    $password = $data['password'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    $stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
    if (!$stmt) {
        throw new Exception("Database prepare error: " . $conn->error);
    }

    $stmt->bind_param("s", $email);
    
    if (!$stmt->execute()) {
        throw new Exception("Database execute error: " . $stmt->error);
    }
    
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
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
            throw new Exception("Invalid credentials");
        }
    } else {
        throw new Exception("Invalid credentials");
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

if (isset($conn)) {
    $conn->close();
}
?>

<?php
// src/pages/register.php (Updated)
include 'cors.php';
include 'db.php';

try {
    $input = file_get_contents("php://input");
    
    if (empty($input)) {
        throw new Exception("No data received");
    }
    
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON data");
    }

    if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
        throw new Exception("Name, email, and password are required");
    }

    $name = trim($data['name']);
    $email = trim($data['email']);
    $password = $data['password'];

    if (empty($name)) {
        throw new Exception("Name cannot be empty");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    if (strlen($password) < 6) {
        throw new Exception("Password must be at least 6 characters long");
    }

    // Check if email exists
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    if (!$check) {
        throw new Exception("Database prepare error: " . $conn->error);
    }

    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        throw new Exception("Email is already registered");
    }

    // Insert new user
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())");
    if (!$stmt) {
        throw new Exception("Database prepare error: " . $conn->error);
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

if (isset($conn)) {
    $conn->close();
}
?>