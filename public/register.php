<?php
// Configuración de la base de datos
$dsn = "mysql:host=localhost;dbname=usuarios_ss";
$username = "aldo";
$password = "EGUA9905";

try {
    // Crear conexión
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtener los datos del formulario
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $contraseña = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hashear la contraseña

    // Preparar y ejecutar la consulta
    $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, email, contraseña) VALUES (:nombre, :email, :contraseña)");
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':contraseña', $contraseña);

    if ($stmt->execute()) {
        // Redirigir a index2.html después del registro exitoso
        header("Location: index2.html");
        exit();
    } else {
        echo "Error: " . $stmt->errorInfo()[2];
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

$pdo = null;
?>
