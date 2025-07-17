import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const handleSocketConnection = (io) => {
  // Middleware for socket authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || user.status !== 'active') {
        return next(new Error('User not found or inactive'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.name} connected (${socket.userId})`);

    // Join user to their personal room
    socket.join(socket.userId);

    // Join role-based rooms
    socket.join(`role_${socket.user.role.toLowerCase()}`);

    // Update user online status
    updateUserStatus(socket.userId, 'online');

    // Broadcast user online status to relevant users
    socket.broadcast.emit('user_status_changed', {
      userId: socket.userId,
      status: 'online',
      user: {
        name: socket.user.name,
        role: socket.user.role
      }
    });

    // Handle joining specific rooms
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.userId} joined room ${roomId}`);
    });

    // Handle leaving rooms
    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.userId} left room ${roomId}`);
    });

    // Handle real-time lead updates
    socket.on('lead_update', (data) => {
      // Broadcast to admins and relevant BDEs
      socket.to('role_admin').emit('lead_updated', data);
      socket.to('role_bde').emit('lead_updated', data);
    });

    // Handle real-time project updates
    socket.on('project_update', (data) => {
      // Broadcast to development team and project managers
      socket.to('role_dev').emit('project_updated', data);
      socket.to('role_pcf').emit('project_updated', data);
      socket.to('role_admin').emit('project_updated', data);
    });

    // Handle typing indicators for chat/comments
    socket.on('typing_start', (data) => {
      socket.to(data.roomId).emit('user_typing', {
        userId: socket.userId,
        userName: socket.user.name,
        roomId: data.roomId
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(data.roomId).emit('user_stopped_typing', {
        userId: socket.userId,
        roomId: data.roomId
      });
    });

    // Handle attendance updates
    socket.on('attendance_update', (data) => {
      // Broadcast to HR and admins
      socket.to('role_hr').emit('attendance_updated', {
        ...data,
        user: {
          name: socket.user.name,
          userId: socket.user.userId
        }
      });
      socket.to('role_admin').emit('attendance_updated', {
        ...data,
        user: {
          name: socket.user.name,
          userId: socket.user.userId
        }
      });
    });

    // Handle meeting reminders
    socket.on('meeting_reminder', (data) => {
      // Send reminder to specific attendees
      if (data.attendees && Array.isArray(data.attendees)) {
        data.attendees.forEach(attendeeId => {
          socket.to(attendeeId).emit('meeting_reminder', {
            meetingId: data.meetingId,
            title: data.title,
            startTime: data.startTime,
            message: `Meeting "${data.title}" starts in ${data.minutesUntil} minutes`
          });
        });
      }
    });

    // Handle invoice notifications
    socket.on('invoice_created', (data) => {
      // Notify accounts team and client contact
      socket.to('role_accounts').emit('invoice_notification', {
        type: 'created',
        invoice: data.invoice,
        message: `New invoice ${data.invoice.invoiceId} created`
      });
    });

    // Handle payment notifications
    socket.on('payment_received', (data) => {
      // Notify accounts team and relevant stakeholders
      socket.to('role_accounts').emit('payment_notification', {
        type: 'received',
        payment: data.payment,
        message: `Payment received for invoice ${data.invoiceId}`
      });
      
      socket.to('role_admin').emit('payment_notification', {
        type: 'received',
        payment: data.payment,
        message: `Payment received for invoice ${data.invoiceId}`
      });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.user.name} disconnected: ${reason}`);
      
      // Update user status to offline
      updateUserStatus(socket.userId, 'offline');
      
      // Broadcast user offline status
      socket.broadcast.emit('user_status_changed', {
        userId: socket.userId,
        status: 'offline',
        user: {
          name: socket.user.name,
          role: socket.user.role
        }
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  // Helper function to update user online status
  async function updateUserStatus(userId, status) {
    try {
      await User.findByIdAndUpdate(userId, {
        onlineStatus: status,
        lastSeen: new Date()
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  }

  // Broadcast system-wide notifications
  const broadcastNotification = (notification) => {
    io.emit('system_notification', notification);
  };

  // Broadcast to specific role
  const broadcastToRole = (role, event, data) => {
    io.to(`role_${role.toLowerCase()}`).emit(event, data);
  };

  // Broadcast to specific user
  const broadcastToUser = (userId, event, data) => {
    io.to(userId).emit(event, data);
  };

  return {
    broadcastNotification,
    broadcastToRole,
    broadcastToUser
  };
};