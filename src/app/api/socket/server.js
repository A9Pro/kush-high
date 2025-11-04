// server.js - Run with: node server.js (npm install socket.io express)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const rooms = new Map(); // { roomId: { gameState, players: [] } }

io.on('connection', (socket) => {
  const { roomId, playerName } = socket.handshake.query;
  socket.join(roomId);

  // Init/join room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, { cards: [], matches: 0, timeLeft: 60, gameOver: false, players: [] });
  }
  const room = rooms.get(roomId);
  room.players.push({ id: socket.id, name: playerName, score: 0 });
  io.to(roomId).emit('playerJoined', room.players);

  socket.on('startGame', ({ cards, timeLeft }) => {
    room.cards = cards;
    room.timeLeft = timeLeft;
    room.gameOver = false;
    room.matches = 0;
    room.players.forEach(p => p.score = 0);
    io.to(roomId).emit('gameState', room);
    // Start timer
    const timer = setInterval(() => {
      if (room.timeLeft > 0) {
        room.timeLeft--;
        io.to(roomId).emit('timerTick', room.timeLeft);
        rooms.set(roomId, room);
      } else {
        clearInterval(timer);
        room.gameOver = true;
        io.to(roomId).emit('gameState', room);
      }
    }, 1000);
  });

  socket.on('flipCard', ({ cardId, playerId }) => {
    const flipped = room.cards[cardId].flipped;
    if (!flipped && room.flippedCards?.length < 2) { // Track flipped on server
      room.flippedCards = room.flippedCards || [];
      room.flippedCards.push(cardId);
      room.cards[cardId].flipped = true;
      io.to(roomId).emit('cardFlipped', { cardId, flippedCards: room.flippedCards });

      if (room.flippedCards.length === 2) {
        const [id1, id2] = room.flippedCards;
        if (room.cards[id1].symbol === room.cards[id2].symbol) {
          room.cards[id1].matched = true;
          room.cards[id2].matched = true;
          room.matches++;
          const scorer = room.players.find(p => p.id === playerId);
          if (scorer) scorer.score += 100;
          io.to(roomId).emit('matchFound', { cardIds: [id1, id2] });
          room.flippedCards = [];
          if (room.matches === 8) {
            room.gameOver = true;
            io.to(roomId).emit('gameState', room);
          }
        } else {
          setTimeout(() => {
            room.cards[id1].flipped = false;
            room.cards[id2].flipped = false;
            io.to(roomId).emit('noMatch', { cardIds: [id1, id2] });
            room.flippedCards = [];
          }, 1000);
        }
        rooms.set(roomId, room);
        io.to(roomId).emit('gameState', room);
      }
    }
  });

  socket.on('restartGame', () => {
    if (room.players.length > 0 && socket.id === room.players[0].id) { // Host only
      room.gameOver = false;
      io.to(roomId).emit('gameState', room);
    }
  });

  socket.on('disconnect', () => {
    room.players = room.players.filter(p => p.id !== socket.id);
    io.to(roomId).emit('playerLeft', room.players);
    if (room.players.length === 0) rooms.delete(roomId);
  });
});

server.listen(3001, () => console.log('Socket server on port 3001'));