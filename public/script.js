const textInput = document.getElementById('textInput');
const keyboard = document.getElementById('keyboard');
const modeToggle = document.getElementById('modeToggle');
const clearButton = document.getElementById('clearButton');
let mode = 'signs-to-text';

// Mapeo de teclas físicas a letras
const keyMap = {
    'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E', 'f': 'F', 'g': 'G',
    'h': 'H', 'i': 'I', 'j': 'J', 'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N',
    'o': 'O', 'p': 'P', 'q': 'Q', 'r': 'R', 's': 'S', 't': 'T', 'u': 'U',
    'v': 'V', 'w': 'W', 'x': 'X', 'y': 'Y', 'z': 'Z', ' ': ' '
};

function generateKeyboard() {
    keyboard.innerHTML = '';

    if (mode === 'signs-to-text') {
        for (let i = 65; i <= 90; i++) {
            const key = document.createElement('div');
            key.className = 'key';

            const img = document.createElement('img');
            img.src = `img/${String.fromCharCode(i)}.jpeg`;
            img.alt = String.fromCharCode(i);

            key.appendChild(img);
            key.addEventListener('click', function() {
                textInput.innerHTML += img.alt;
            });
            keyboard.appendChild(key);
        }

        // Añadir el botón de espacio
        const spaceKey = document.createElement('div');
        spaceKey.className = 'key space-button';
        spaceKey.innerText = 'Espacio';
        spaceKey.addEventListener('click', function() {
            textInput.innerHTML += ' ';
        });
        keyboard.appendChild(spaceKey);

    } else if (mode === 'text-to-signs') {
        for (let i = 65; i <= 90; i++) {
            const key = document.createElement('div');
            key.className = 'key';
            key.innerText = String.fromCharCode(i);
            key.addEventListener('click', function() {
                const letter = key.innerText;
                const img = document.createElement('img');
                img.src = `img/${letter}.jpeg`;
                img.alt = letter;
                img.style.width = '100px'; // Ajustar el ancho de la imagen
                img.style.height = '100px'; // Ajustar la altura de la imagen
                textInput.appendChild(img);
            });
            keyboard.appendChild(key);
        }
    }
}

function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (keyMap[key] !== undefined) {
        if (mode === 'signs-to-text') {
            textInput.innerHTML += keyMap[key];
        } else if (mode === 'text-to-signs') {
            const letter = keyMap[key];
            const img = document.createElement('img');
            img.src = `img/${letter}.jpeg`;
            img.alt = letter;
            img.style.width = '100px'; // Ajustar el ancho de la imagen
            img.style.height = '100px'; // Ajustar la altura de la imagen
            textInput.appendChild(img);
        }
    }
}

modeToggle.addEventListener('click', function() {
    if (mode === 'signs-to-text') {
        mode = 'text-to-signs';
        modeToggle.innerText = 'Cambiar a Lenguaje de Señas + Texto';
    } else {
        mode = 'signs-to-text';
        modeToggle.innerText = 'Cambiar a Texto = Lenguaje de Señas';
    }
    generateKeyboard();
});

clearButton.addEventListener('click', function() {
    textInput.innerHTML = '';
});

window.addEventListener('keydown', handleKeyDown);

generateKeyboard();

