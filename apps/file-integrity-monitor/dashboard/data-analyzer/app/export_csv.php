<?php
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("Location: login.php");
    exit;
}

include 'db_connect.php';
$table = 'centralised_fim_db';

$startDate = $_POST['startDate'] ?? date("Y-m-d", strtotime("-2 days"));
$endDate   = $_POST['endDate'] ?? date("Y-m-d");
$machineFilter = $_POST['machineFilter'] ?? "";
$conclusionFilter = $_POST['conclusionFilter'] ?? "";

$sql = "SELECT id, machine_identifier, conclusion, timestamp, readable_text_cmd, data_changed
        FROM `$table`
        WHERE timestamp BETWEEN ? AND ?";

$params = [$startDate . " 00:00:00", $endDate . " 23:59:59"];
$types  = "ss";

if (!empty($machineFilter)) {
    $sql .= " AND machine_identifier LIKE ?";
    $params[] = "%" . $machineFilter . "%";
    $types .= "s";
}
if (!empty($conclusionFilter)) {
    $sql .= " AND conclusion LIKE ?";
    $params[] = "%" . $conclusionFilter . "%";
    $types .= "s";
}

$sql .= " ORDER BY id DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

// Download headers
$filename = "fim_audit_export_" . $startDate . "_to_" . $endDate . ".csv";
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="'.$filename.'"');

// Output CSV
$output = fopen('php://output', 'w');

// CSV header row
fputcsv($output, ['ID', 'Machine Identifier', 'Conclusion', 'Timestamp', 'Execution Command', 'Data Diff']);

while ($row = $result->fetch_assoc()) {
    // Keep diff as full text; CSV will quote it safely
    fputcsv($output, [
        $row['id'],
        $row['machine_identifier'],
        $row['conclusion'],
        $row['timestamp'],
        $row['readable_text_cmd'],
        $row['data_changed']
    ]);
}

fclose($output);

$stmt->close();
$conn->close();
exit;
