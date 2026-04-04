const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:3000" }
});

io.on('connection', (socket) => {
    console.log('En enhet ansluten (Kiosk eller Kök)');

    socket.on('new_order', (order) => {
        console.log('Ny order mottagen:', order);
        io.emit('display_order', order);
    });
});

server.listen(4000, () => console.log('Server running on port 4000'));