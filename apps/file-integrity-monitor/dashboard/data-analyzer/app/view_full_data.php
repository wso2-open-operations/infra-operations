<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("Location: login.php");
    exit;
}

include 'db_connect.php';

if (!$conn) {
    die("Database connection failed.");
}

if (!isset($_GET['id'])) {
    die("Invalid request.");
}

$id = intval($_GET['id']);

$sql = "SELECT data_changed FROM centralised_fim_db WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    die("No data found.");
}

$row = $result->fetch_assoc();
$lines = explode("\n", $row['data_changed']);

echo "<!DOCTYPE html>
<html>
<head>
<title>Full Data Diff - ID $id</title>
<style>
body { font-family: monospace; font-size: 13px; padding: 20px; background: #fff; }
.diff-box { background: #f9f9f9; border: 1px solid #ccc; padding: 10px; overflow-x: auto; }
.add { color: green; }
.del { color: red; }
.meta { color: gray; font-style: italic; }
</style>
</head>
<body>";

echo "<h2>Full Data Diff (Record ID: $id)</h2>";
echo "<div class='diff-box'><pre>";

foreach ($lines as $line) {
    $escaped = htmlspecialchars($line);

    if (str_starts_with($line, '+')) {
        echo "<span class='add'>$escaped</span>\n";
    } elseif (str_starts_with($line, '-')) {
        echo "<span class='del'>$escaped</span>\n";
    } elseif (str_starts_with($line, '@@') || str_starts_with($line, '---') || str_starts_with($line, '+++')) {
        echo "<span class='meta'>$escaped</span>\n";
    } else {
        echo "$escaped\n";
    }
}

echo "</pre></div></body></html>";

$stmt->close();
$conn->close();
?>
