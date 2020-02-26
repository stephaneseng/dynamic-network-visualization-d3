<?php

define('OUTPUT_DIRECTORY', __DIR__ . '/../../var/output/png');

$date = $_GET['date'];
$tick = str_pad($_GET['tick'], 3, '0', STR_PAD_LEFT);

$data = file_get_contents('php://input');
$data = base64_decode($data);

file_put_contents(OUTPUT_DIRECTORY . '/' . $date . '-' . $tick . '.png', $data);
