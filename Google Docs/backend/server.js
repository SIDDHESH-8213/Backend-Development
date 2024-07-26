// server/server.js
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');
const express = require('express');

app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Change this to your frontend's origin
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinDocument', (documentId) => {
        socket.join(documentId);
    });

    socket.on('documentChange', (documentId, content) => {
        socket.to(documentId).emit('receiveDocumentChange', content);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT =  5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { io }; // Export io instance
