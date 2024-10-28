const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let gameState = {
  slots: Array(10).fill(null),
  deck: [
    { id: 1, name: 'Player 1', initiative: 20 },
    { id: 2, name: 'Player 2', initiative: 18 },
    // Add more cards as needed
  ],
  discardPile: []
};

io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send current game state to new connections
  socket.emit('updateBoard', gameState);

  // Handle board updates
  socket.on('updateBoard', (newState) => {
    gameState = newState;
    // Broadcast to all clients except sender
    socket.broadcast.emit('updateBoard', gameState);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});