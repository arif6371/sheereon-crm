import express from 'express';
import Notification from '../models/Notification.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { read, type, limit = 50 } = req.query;
    
    let query = { recipient: req.user._id };
    
    // Filter by read status
    if (read !== undefined) {
      query.read = read === 'true';
    }
    
    // Filter by type
    if (type && type !== 'all') {
      query.type = type;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      message: 'Failed to fetch notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ 
      message: 'Failed to mark notification as read',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ 
      message: 'Failed to mark all notifications as read',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Delete notification
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ 
      message: 'Failed to delete notification',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get notification count
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const [total, unread] = await Promise.all([
      Notification.countDocuments({ recipient: req.user._id }),
      Notification.countDocuments({ recipient: req.user._id, read: false })
    ]);

    res.json({ total, unread });
  } catch (error) {
    console.error('Error fetching notification count:', error);
    res.status(500).json({ 
      message: 'Failed to fetch notification count',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create notification (internal use)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { recipient, type, title, message, data, priority, actionUrl } = req.body;

    if (!recipient || !type || !title || !message) {
      return res.status(400).json({ 
        message: 'Recipient, type, title, and message are required' 
      });
    }

    const notification = new Notification({
      recipient,
      sender: req.user._id,
      type,
      title,
      message,
      data,
      priority: priority || 'medium',
      actionUrl
    });

    await notification.save();
    await notification.populate('sender', 'name email role');

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(recipient.toString()).emit('notification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        timestamp: notification.createdAt,
        sender: notification.sender
      });
    }

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ 
      message: 'Failed to create notification',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;