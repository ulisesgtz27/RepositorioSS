// Inicializa Pusher
const pusher = new Pusher('8ca6ee5a8fb4754216e3', {
    cluster: 'us2'
  });
  
  // Suscríbete al canal
  const channel = pusher.subscribe('my-channel');
  
  // Maneja los mensajes entrantes
  channel.bind('my-event', function(data) {
    const messages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
  
    if (data.type === 'text') {
      messageElement.innerHTML = '<p>' + data.content + '</p>'; // No necesita emojione.toImage aquí
    } else if (data.type === 'image') {
      messageElement.innerHTML = '<img src="' + data.content + '" alt="Imagen" class="chat-image">';
    } else if (data.type === 'file') {
      messageElement.innerHTML = `
        <div class="file-message">
          <i class="mdi mdi-file-document-outline"></i>
          <span>${data.name}</span>
          <button class="file-download-button" onclick="window.open('${data.content}', '_blank')">
            <i class="mdi mdi-arrow-down-bold-circle-outline"></i>
          </button>
        </div>`;
    }
  
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
  });
  
  // Función para enviar un mensaje
  function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value;
    if (message.trim() !== '') {
      // Aquí debes enviar el mensaje al backend
      fetch('send_message.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'text', content: message })
      }).then(response => response.json())
        .then(data => {
          input.value = ''; // Limpia el campo de entrada después de enviar
        });
    }
  }
  
  // Función para manejar la carga de archivos
  function sendFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const fileContent = event.target.result;
        fetch('send_message.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: file.type.startsWith('image/') ? 'image' : 'file',
            content: fileContent,
            name: file.name
          })
        }).then(response => response.json())
          .then(data => {
            fileInput.value = ''; // Limpia el input después de enviar
          });
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Función para mostrar/ocultar el selector de emojis
  function toggleEmojiPicker() {
    const picker = document.getElementById('emoji-picker');
    picker.style.display = picker.style.display === 'none' || picker.style.display === '' ? 'block' : 'none';
  }
  
  // Agrega emojis al campo de entrada
  document.getElementById('emoji-picker').addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('emoji')) {
      const emoji = event.target.dataset.emoji;
      const input = document.getElementById('chat-input');
      input.value += emoji;
      toggleEmojiPicker(); // Cierra el picker después de seleccionar un emoji
    }
  });
  
  // Carga emojis en el picker
  function loadEmojis() {
    const picker = document.getElementById('emoji-picker');
    // Emojis de ejemplo, reemplaza con los datos reales si es necesario
    const emojis = [
      '😊', '😂', '😍', '😢', '😎', '😜'
    ];
    emojis.forEach(emoji => {
      const emojiElement = document.createElement('span');
      emojiElement.classList.add('emoji');
      emojiElement.dataset.emoji = emoji;
      emojiElement.textContent = emoji;
      picker.appendChild(emojiElement);
    });
  }
  
  // Inicializa el picker de emojis
  loadEmojis();
  