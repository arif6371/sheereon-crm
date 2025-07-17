import express from 'express';
import Notice from '../models/Notice.js';
import { authenticateToken, requireHR } from '../middleware/auth.js';

const router = express.Router();

// Get all notices
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { targetAudience } = req.query;
    
    let query = { isActive: true };
    
    // Filter by target audience if specified
    if (targetAudience && targetAudience !== 'all') {
      query.$or = [
        { targetAudience: 'all' },
        { targetAudience: targetAudience }
      ];
    } else {
      // Show notices for user's role or all
      query.$or = [
        { targetAudience: 'all' },
        { targetAudience: req.user.role.toLowerCase() }
      ];
    }
    
    // Filter expired notices
    query.$or = [
      { expiryDate: { $exists: false } },
      { expiryDate: null },
      { expiryDate: { $gte: new Date() } }
    ];

    const notices = await Notice.find(query)
      .populate('postedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ 
      message: 'Failed to fetch notices',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create new notice
router.post('/', authenticateToken, requireHR, async (req, res) => {
  try {
    const { title, content, type, priority, targetAudience, expiryDate } = req.body;

    // Validate required fields
    if (!title || !content || !type) {
      return res.status(400).json({ 
        message: 'Title, content, and type are required' 
      });
    }

    const notice = new Notice({
      title: title.trim(),
      content: content.trim(),
      type,
      priority: priority || 'medium',
      targetAudience: targetAudience || 'all',
      postedBy: req.user._id,
      expiryDate: expiryDate ? new Date(expiryDate) : null
    });

    await notice.save();
    await notice.populate('postedBy', 'name role');

    // Emit real-time notification to all connected users
    const io = req.app.get('io');
    if (io) {
      io.emit('new_notice', {
        notice,
        notification: {
          type: 'info',
          title: 'New Notice Posted',
          message: `${notice.title}`,
          priority: notice.priority
        }
      });
    }

    res.status(201).json({
      message: 'Notice posted successfully',
      notice
    });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ 
      message: 'Failed to create notice',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Mark notice as read
router.post('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Add user to readBy array if not already present
    if (!notice.readBy.some(reader => reader.user.toString() === req.user._id.toString())) {
      notice.readBy.push({ user: req.user._id });
      await notice.save();
    }

    res.json({ message: 'Notice marked as read' });
  } catch (error) {
    console.error('Error marking notice as read:', error);
    res.status(500).json({ 
      message: 'Failed to mark notice as read',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update notice (Admin/HR only)
router.put('/:id', authenticateToken, requireHR, async (req, res) => {
  try {
    const { title, content, type, priority, targetAudience, expiryDate, isActive } = req.body;
    
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Update fields
    if (title) notice.title = title.trim();
    if (content) notice.content = content.trim();
    if (type) notice.type = type;
    if (priority) notice.priority = priority;
    if (targetAudience) notice.targetAudience = targetAudience;
    if (expiryDate !== undefined) notice.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (isActive !== undefined) notice.isActive = isActive;

    await notice.save();
    await notice.populate('postedBy', 'name role');

    res.json({
      message: 'Notice updated successfully',
      notice
    });
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({ 
      message: 'Failed to update notice',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Delete notice (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only admins can delete notices' });
    }

    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ 
      message: 'Failed to delete notice',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;