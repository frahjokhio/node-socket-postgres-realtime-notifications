import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import db from './db';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Define routes before server.listen()
app.get('/notifications', async (req, res) => {
  try {
    const notifications = await db.any('SELECT * FROM notifications');
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Serve static files (this should be after your routes if you want to avoid route conflicts)
app.use(express.static('public'));

io.on('connection', (socket) => {

  console.log('Socket.io connected !');

  // Send a welcome message to the new client
  socket.emit('welcome', 'Welcome to the Real-Time Notification Service!');

  // Listen for a 'sendNotification' event
  socket.on('sendNotification', async (data) => {
    try {

      // Save notification to the database
      await db.none('INSERT INTO "notifications" (message) VALUES ($1)', [data.message]);

      // Broadcast the notification to all clients
      io.emit('notification', data.message);
    } catch (err) {
      console.error('Failed to send notification:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket.io disconnected !');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
