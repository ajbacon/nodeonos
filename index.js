const express = require('express');
const socket = require('socket.io');
const radioStreams = require('./radio/radioStreams');

const app = express();

// with more time maybe some in memory storage solution for this? Redis?
let sessionState = {
  isPlaying: false,
  playingId: null,
};

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('getStreamData', () => {
    io.emit('serverStreamData', sessionState);
  });

  socket.on('selectStream', (data) => {
    sessionState.playingId = data;
    io.emit('serverStreamData', sessionState);
  });
});
