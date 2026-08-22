// src/sockets.js
const { Server } = require('socket.io');

let io;

function initSockets(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    socket.on('join_trip', (tripId) => {
      socket.join(`trip:${tripId}`);
    });

    socket.on('leave_trip', (tripId) => {
      socket.leave(`trip:${tripId}`);
    });
  });

  return io;
}

function emitTripEvent(tripId, event, data) {
  if (io) {
    io.to(`trip:${tripId}`).emit(event, data);
  }
}

module.exports = { initSockets, emitTripEvent };