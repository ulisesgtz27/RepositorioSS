<?php
require 'vendor/autoload.php';

use Pusher\Pusher;

$options = array(
    'cluster' => 'us2',
    'useTLS' => true
);

$pusher = new Pusher(
    '8ca6ee5a8fb4754216e3',  // Reemplaza con tu app_key
    'cc4d18def3112b2dcc76',        // Reemplaza con tu app_secret
    '1847410',            // Reemplaza con tu app_id
    $options
);

$data = json_decode(file_get_contents('php://input'), true);

$pusher->trigger('my-channel', 'my-event', $data);

echo json_encode(['status' => 'success']);
?>
