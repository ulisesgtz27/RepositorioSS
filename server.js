const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://www.youtube.com"],
            frameSrc: ["'self'", "https://www.youtube.com"],
            styleSrc: ["'self'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https://www.youtube.com"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"]
        }
    }
}));

// Middleware para limitar el número de solicitudes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limita cada IP a 100 solicitudes por ventana de tiempo
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Middleware para analizar cuerpos de solicitud JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Ruta para manejar mensajes de chat con traducción
app.post('/send-message', [
    body('message').isString().trim().notEmpty().withMessage('Message must not be empty'),
    body('targetLanguage').isString().trim().notEmpty().withMessage('Target language must not be empty')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { message, targetLanguage } = req.body;

    try {
        // Traduce el mensaje usando LibreTranslate
        const response = await axios.post('https://libretranslate.de/translate', {
            q: message,
            source: 'en',
            target: targetLanguage
        });
        res.json({ translatedMessage: response.data.translatedText });
    } catch (error) {
        res.status(500).json({ error: 'Translation failed' });
    }
});

// Manejo de conexiones de Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
