# Private Chat Backend 🔐

A real-time private chat backend built with Node.js, Express, Socket.io, and MongoDB.

## Features

✅ Real-time messaging with Socket.io  
✅ MongoDB database for message persistence  
✅ Multiple chat rooms support  
✅ User presence tracking  
✅ CORS enabled for frontend integration  

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Create .env File
```bash
cp .env.example .env
```

### 3. Add MongoDB Connection String
Get a free MongoDB Atlas account: https://www.mongodb.com/cloud/atlas

Update your `.env`:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Run Locally
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Deploy on Railway

1. Go to https://railway.app
2. Connect your GitHub repository
3. Add environment variables (MONGODB_URI)
4. Deploy!

## Frontend Integration

Update your frontend to connect to this backend:

```javascript
const socket = io('https://your-railway-url.railway.app');

socket.emit('join-room', { room: 'room123', user: 'User1' });
socket.emit('send-message', { room: 'room123', user: 'User1', message: 'Hello!' });
socket.on('receive-message', (data) => {
  console.log(data.user + ': ' + data.message);
});
```

## API Endpoints

- `GET /` - Health check
- `GET /api/messages/:room` - Get all messages in a room

## Socket Events

- `join-room` - User joins a chat room
- `send-message` - Send a message to the room
- `receive-message` - Receive a message from the room
- `user-joined` - Notification when user joins
