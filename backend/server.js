import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import riderRoutes from './routes/rider.js';
import orderRoutes from './routes/order.js';
import paymentRoutes from './routes/payment.js';
import ratingRoutes from './routes/rating.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/rider', riderRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('rider-online', (riderId) => {
    socket.join(`rider-${riderId}`);
    socket.broadcast.emit('rider-status-changed', { riderId, status: 'online' });
  });

  socket.on('rider-offline', (riderId) => {
    socket.leave(`rider-${riderId}`);
    socket.broadcast.emit('rider-status-changed', { riderId, status: 'offline' });
  });

  socket.on('new-order', (orderData) => {
    // Notify nearby riders
    socket.broadcast.emit('order-request', orderData);
  });

  socket.on('order-accepted', (data) => {
    io.to(`user-${data.userId}`).emit('order-accepted', data);
  });

  socket.on('order-ignored', (data) => {
    // Handle ignored order
  });

  socket.on('track-location', (data) => {
    io.to(`user-${data.userId}`).emit('location-update', data);
  });

  socket.on('join-chat', (orderId) => {
    socket.join(`chat-${orderId}`);
  });

  socket.on('send-message', (data) => {
    io.to(`chat-${data.orderId}`).emit('new-message', data);
  });

  socket.on('call-request', (data) => {
    io.to(`user-${data.targetUserId}`).emit('incoming-call', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };

