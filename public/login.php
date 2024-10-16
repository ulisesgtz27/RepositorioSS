<?php
// Configuración de la base de datos
$dsn = "mysql:host=localhost;dbname=usuarios2_ss";
$username = "aldo";
$password = "EGUA9905";

try {
    // Crear conexión
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtener los datos del formulario
    $email = $_POST['email'];
    $contraseña = $_POST['password'];

    // Preparar y ejecutar la consulta
    $stmt = $pdo->prepare("SELECT nombre, contraseña FROM usuarios WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        // Verificar la contraseña
        if (password_verify($contraseña, $row['contraseña'])) {
            // Establecer la sesión del usuario
            session_start();
            $_SESSION['nombre'] = $row['nombre'];
            $_SESSION['email'] = $email;
            // Redirigir a index2.html después del inicio de sesión exitoso
            header("Location: index2.html");
            exit();
        } else {
            echo "<script>alert('Contraseña incorrecta'); window.location.href='login.html';</script>";
        }
    } else {
        echo "<script>alert('Usuario no encontrado'); window.location.href='login.html';</script>";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

$pdo = null;
?>
