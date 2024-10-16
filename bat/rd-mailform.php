<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

$formConfigFile = file_get_contents("rd-mailform.config.json");
$formConfig = json_decode($formConfigFile, true);

date_default_timezone_set('Etc/UTC');

try {
    $recipients = $formConfig['recipientEmail'];

    if (!filter_var($recipients, FILTER_VALIDATE_EMAIL)) {
        die('MF001');
    }

    function getRemoteIPAddress() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        return $_SERVER['REMOTE_ADDR'];
    }

    $subject = 'Mensaje de contacto';
    $email = isset($_POST['email']) ? $_POST['email'] : die('MF004');
    $name = isset($_POST['name']) ? $_POST['name'] : 'Anónimo';
    $phone = isset($_POST['phone']) ? $_POST['phone'] : 'Sin teléfono';
    $message = isset($_POST['message']) ? $_POST['message'] : '';

    // Cargar la plantilla
    $template = file_get_contents('rd-mailform.tpl');
    $template = str_replace(
        array('<!-- #{Subject} -->', '<!-- #{FromName} -->', '<!-- #{Phone} -->', '<!-- #{FromEmail} -->', '<!-- #{Message} -->', '<!-- #{SiteName} -->'),
        array($subject, $name, $phone, $email, $message, $_SERVER['SERVER_NAME']),
        $template
    );

    $mail = new PHPMailer();

    if ($formConfig['useSmtp']) {
        $mail->isSMTP();
        $mail->SMTPDebug = 0;
        $mail->Debugoutput = 'html';
        $mail->Host = $formConfig['host'];
        $mail->Port = $formConfig['port'];
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = "ssl";
        $mail->Username = $formConfig['username'];
        $mail->Password = $formConfig['password'];
    }

    $mail->setFrom($email, $name);
    $mail->addAddress($recipients);

    if (isset($_FILES['file']) && $_FILES['file']['error'] == UPLOAD_ERR_OK) {
        $mail->addAttachment($_FILES['file']['tmp_name'], $_FILES['file']['name']);
    }

    $mail->CharSet = 'UTF-8';
    $mail->Subject = $subject;
    $mail->MsgHTML($template);

    if (!$mail->send()) {
        echo 'Mailer Error: ' . $mail->ErrorInfo;
        die('MF254');
    }

    die('MF000');
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
    die('MF255');
}

