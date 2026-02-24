<?php
/**
 * db_connect.php
 * Purpose: Connect PHP Dashboard (Docker) → Local MySQL (Host)
 * Mode   : TCP only (NO socket, NO SSL)
 */

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

/* =========================
   Load environment variables
   ========================= */
$host   = getenv('DB_HOST') ?: '127.0.0.1';
$user   = getenv('DB_USER') ?: '';
$pass   = getenv('DB_PASS') ?: '';
$dbname = getenv('DB_NAME') ?: '';
$port   = getenv('DB_PORT') ?: 3306;

/* =========================
   Basic validation
   ========================= */
if (!$user || !$dbname) {
    die('❌ Database environment variables not set');
}

/* =========================
   Init MySQLi
   ========================= */
$conn = mysqli_init();
if (!$conn) {
    die('❌ mysqli_init failed');
}

/* =========================
   IMPORTANT:
   - NO SSL
   - NO socket
   - Force TCP
   ========================= */
mysqli_options($conn, MYSQLI_OPT_CONNECT_TIMEOUT, 5);

/* =========================
   Connect
   ========================= */
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

/* =========================
   Charset safety
   ========================= */
$conn->set_charset('utf8mb4');

/* =========================
   Success (optional log)
   ========================= */
// echo "✅ DB connected successfully";
