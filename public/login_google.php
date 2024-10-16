<?php
require_once 'vendor/autoload.php';

// Configuración de Google API
$client = new Google_Client(['client_id' => '877090624630-0dr095smslthn0j7bke4gks7eeh2s084.apps.googleusercontent.com']);
$idToken = json_decode(file_get_contents('php://input'), true)['idToken'];

try {
    $payload = $client->verifyIdToken($idToken);
    if ($payload) {
        $google_id = $payload['sub'];
        $nombre = $payload['name'];
        $email = $payload['email'];

        // Conexión a la base de datos
        $dsn = "mysql:host=localhost;dbname=usuarios_ss";
        $username = "aldo";
        $password = "EGUA9905";

        $pdo = new PDO($dsn, $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Verificar si el usuario ya existe
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE google_id = :google_id OR email = :email");
        $stmt->bindParam(':google_id', $google_id);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            // Usuario ya existe, iniciar sesión
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            session_start();
            $_SESSION['nombre'] = $row['nombre'];
            $_SESSION['email'] = $row['email'];
        } else {
            // Nuevo usuario, registrar y luego iniciar sesión
            $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, email, google_id) VALUES (:nombre, :email, :google_id)");
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':google_id', $google_id);
            $stmt->execute();

            session_start();
            $_SESSION['nombre'] = $nombre;
            $_SESSION['email'] = $email;
        }

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
