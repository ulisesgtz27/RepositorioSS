// Duración del tiempo de espera en milisegundos
const redirectTimeout = 9000; // 3 minutos

// Función para redirigir a login.php
function redirectToLogin() {
    window.location.href = 'login.php';
}

// Función para calcular el tiempo restante y configurar el temporizador
function setRedirectTimeout() {
    const now = Date.now();
    const startTime = sessionStorage.getItem('startTime');
    
    if (startTime) {
        const elapsedTime = now - startTime;
        const remainingTime = redirectTimeout - elapsedTime;
        
        if (remainingTime <= 0) {
            redirectToLogin();
        } else {
            setTimeout(redirectToLogin, remainingTime);
        }
    } else {
        sessionStorage.setItem('startTime', now);
        setTimeout(redirectToLogin, redirectTimeout);
    }
}

// Configura el temporizador cuando la página carga
window.addEventListener('load', setRedirectTimeout);
