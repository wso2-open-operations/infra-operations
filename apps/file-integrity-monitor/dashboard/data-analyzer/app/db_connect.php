<!--  Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).

 WSO2 LLC. licenses this file to you under the Apache License,
 Version 2.0 (the "License"); you may not use this file except
 in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License. -->

<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host   = getenv('DB_HOST') ?: '127.0.0.1';
$user   = getenv('DB_USER') ?: '';
$pass   = getenv('DB_PASS') ?: '';
$dbname = getenv('DB_NAME') ?: '';
$port   = getenv('DB_PORT') ?: 3306;


if (!$user || !$dbname) {
    die(' Database environment variables not set');
}

$conn = mysqli_init();
if (!$conn) {
    die(' mysqli_init failed');
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
    die(' Database connection failed: ' . $e->getMessage());
}

$conn->set_charset('utf8mb4');

