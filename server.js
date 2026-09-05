const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://chatuser:chatpass@cluster.mongodb.net/privatechat?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Message Schema
const messageSchema = new mongoose.Schema({
  room: String,
  user: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Routes
app.get('/', (req, res) => {
  res.send('🚀 Private Chat Backend is Running!');
});

// Get messages for a room
app.get('/api/messages/:room', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room })
      .sort({ timestamp: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Socket.io Events
io.on('connection', (socket) => {
  console.log('👤 New user connected:', socket.id);

  // User joins a room
  socket.on('join-room', (data) => {
    const { room, user } = data;
    socket.join(room);
    console.log(`✅ ${user} joined room: ${room}`);
    
    // Notify others in room
    io.to(room).emit('user-joined', {
      user: user,
      message: `${user} joined the chat`
    });
  });

  // Send message
  socket.on('send-message', async (data) => {
    const { room, user, message } = data;
    const timestamp = new Date();

    try {
      // Save to MongoDB
      const newMessage = new Message({
        room,
        user,
        message,
        timestamp
      });
      await newMessage.save();

      // Broadcast to room
      io.to(room).emit('receive-message', {
        user,
        message,
        timestamp: timestamp.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      });
    } catch (err) {
      console.log('Error saving message:', err);
    }
  });

  // User leaves
  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🎉 Server running on port ${PORT}`);
});
