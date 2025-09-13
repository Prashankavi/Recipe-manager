<?php
// src/pages/db.php
$host = "localhost";
$user = "root";
$pass = "";
$db = "recipe_manager";

// Enable CORS for React frontend
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $conn = new mysqli($host, $user, $pass, $db);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Set charset to utf8
    $conn->set_charset("utf8");
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Database connection failed: " . $e->getMessage()
    ]);
    exit();
}

// If accessed directly, show success message
if (basename($_SERVER['PHP_SELF']) === "db.php") {
    echo "✅ Database connected successfully!";
    exit();
}
?>

