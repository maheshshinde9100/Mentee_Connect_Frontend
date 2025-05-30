const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Store active meetings and their participants
const meetings = new Map();

io.on('connection', (socket) => {
  const { meetingId, userId, isHost } = socket.handshake.query;
  
  console.log(`User ${userId} connecting to meeting ${meetingId}`);
  
  // Join the meeting room
  socket.join(meetingId);
  
  // Initialize meeting if it doesn't exist
  if (!meetings.has(meetingId)) {
    meetings.set(meetingId, {
      hostId: isHost === 'true' ? userId : null,
      participants: new Set()
    });
  }
  
  const meeting = meetings.get(meetingId);
  
  // Add participant to the meeting
  meeting.participants.add(userId);
  
  // Notify others in the room about the new participant
  socket.to(meetingId).emit('participant-joined', {
    participantId: userId
  });
  
  // Handle WebRTC signaling
  socket.on('offer', ({ offer, targetId }) => {
    socket.to(meetingId).emit('offer', {
      offer,
      senderId: userId
    });
  });
  
  socket.on('answer', ({ answer, targetId }) => {
    socket.to(meetingId).emit('answer', {
      answer,
      senderId: userId
    });
  });
  
  socket.on('ice-candidate', ({ candidate, targetId }) => {
    socket.to(meetingId).emit('ice-candidate', {
      candidate,
      senderId: userId
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected from meeting ${meetingId}`);
    
    if (meetings.has(meetingId)) {
      const meeting = meetings.get(meetingId);
      
      // Remove participant
      meeting.participants.delete(userId);
      
      // Notify others
      socket.to(meetingId).emit('participant-left', {
        participantId: userId
      });
      
      // If host left or no participants left, clean up the meeting
      if (userId === meeting.hostId || meeting.participants.size === 0) {
        meetings.delete(meetingId);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
}); 