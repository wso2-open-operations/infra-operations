<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host   = getenv('DB_HOST') ?: '127.0.0.1';
$user   = getenv('DB_USER') ?: '';
$pass   = getenv('DB_PASS') ?: '';
$dbname = getenv('DB_NAME') ?: '';
$port   = getenv('DB_PORT') ?: 3306;


if (!$user || !$dbname) {
    die('❌ Database environment variables not set');
}

$conn = mysqli_init();
if (!$conn) {
    die('❌ mysqli_init failed');
}

mysqli_options($conn, MYSQLI_OPT_CONNECT_TIMEOUT, 5);

try {
    mysqli_real_connect(
        $conn,
        $host,     // MUST be 127.0.0.1
        $user,
        $pass,
        $dbname,
        (int)$port,
        null,      // socket → NULL (very important)
        0          // flags → NO SSL
    );
} catch (mysqli_sql_exception $e) {
    die('❌ Database connection failed: ' . $e->getMessage());
}

$conn->set_charset('utf8mb4');

// echo "✅ DB connected successfully";
