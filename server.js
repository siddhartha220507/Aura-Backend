const http = require('http'); // Node ka in-built module
const { Server } = require('socket.io');
require('dotenv').config();
const connectDB = require('./src/config/db');
const app = require('./src/app');

// Database Connect
connectDB();

// Express app ko HTTP server mein wrap karna
const server = http.createServer(app);

// Socket.io initialize karna
const io = new Server(server, {
  cors: {
    origin: '*', // Jab React chalega, toh allow karne ke liye
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Worker ko io ka access dene ke liye isko global bana rahe hain
global.io = io;

// Jab bhi koi user frontend se connect hoga
io.on('connection', (socket) => {
  console.log(`🔌 Naya Frontend Connected! Socket ID: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`❌ Frontend Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// DHYAN DEIN: app.listen ki jagah server.listen call karna hai
server.listen(PORT, () => {
  console.log(`🚀 Aura Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // Start the background worker
  require('./src/workers/focusWorker'); 
  console.log(`👷 Focus Background Worker is active and listening...`);
});