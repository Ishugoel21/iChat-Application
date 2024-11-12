const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // To resolve file paths

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (like CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Listen for connections
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('new-user-joined', (name) => {
        socket.broadcast.emit('user-joined', name); // Notify other users
    });

    socket.on('send', (message) => {
        io.emit('receive', { name: 'User', message }); // Broadcast message to all users
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', 'User');
        console.log('A user disconnected');
    });
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server on port 8000
server.listen(8000, () => {
    console.log('Server running at http://localhost:8000');
});
