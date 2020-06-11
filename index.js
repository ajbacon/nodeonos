const express = require('express');
const socket = require('socket.io');
const radioStreams = require('./radio/radioStreams');

const app = express();

// with more time maybe some in memory storage solution for this? Redis?
let sessionState = {
  availableStreams: radioStreams,
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
    io.emit('serverStreamData', JSON.stringify(sessionState));
  });

  socket.on('selectStream', (data) => {
    sessionState.playingId = data;
    io.emit('serverStreamData', JSON.stringify(sessionState));
  });

  socket.on('play-pause', (data) => {
    console.log(sessionState);

    if (data === 'switch') {
      const playing = !sessionState.isPlaying;
      sessionState = { ...sessionState, isPlaying: playing };
    }
    io.emit('serverStreamData', JSON.stringify(sessionState));
    // console.log(sessionState);
  });
});
