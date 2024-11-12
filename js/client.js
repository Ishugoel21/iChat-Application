const socket = io('http://localhost:8000'); // Ensure this points to your server
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const audio = new Audio('news-ting-6832.mp3');

// Function to append messages to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
};

// Event listener for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message); // Emit the message to the server
    messageInput.value = ''; // Clear the input field
});

// Prompt for user's name and emit 'new-user-joined' event
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// Listen for 'user-joined' event and update chat
socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'right');
});

// Listen for 'receive' event and update chat with incoming messages
socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});

// Listen for 'left' event and update chat when user leaves
socket.on('left', (name) => {
    append(`${name}: left the chat`, 'left');
});
