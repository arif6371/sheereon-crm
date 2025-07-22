import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { seedDatabase } from './utils/seedData.js';
import { handleSocketConnection } from './socket/socketHandlers.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import leadRoutes from './routes/leads.js';
import projectRoutes from './routes/projects.js';
import noticeRoutes from './routes/notices.js';
import meetingRoutes from './routes/meetings.js';
import notificationRoutes from './routes/notifications.js';
import dashboardRoutes from './routes/dashboard.js';
import attendanceRoutes from './routes/attendance.js';
import leaveRoutes from './routes/leaves.js';
import invoiceRoutes from './routes/invoices.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .then(async () => {
    // Seed database with sample data in development
    try {
      const seedResult = await seedDatabase();
      console.log('📊 Sample data seeded:', seedResult);
    } catch (error) {
      console.log('⚠️ Database already contains data, skipping seed');
    }
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Socket.io connection handling with authentication
const socketHandlers = handleSocketConnection(io);

// Make io available to routes
app.set('io', io);
app.set('socketHandlers', socketHandlers);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/leads', authenticateToken, leadRoutes);
app.use('/api/projects', authenticateToken, projectRoutes);
app.use('/api/notices', authenticateToken, noticeRoutes);
app.use('/api/meetings', authenticateToken, meetingRoutes);
app.use('/api/notifications', authenticateToken, notificationRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/attendance', authenticateToken, attendanceRoutes);
app.use('/api/leaves', authenticateToken, leaveRoutes);
app.use('/api/invoices', authenticateToken, invoiceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Socket.io server ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

export { io };