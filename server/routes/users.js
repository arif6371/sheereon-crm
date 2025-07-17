import express from 'express';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, role, department } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (department && department !== 'all') {
      query.department = department;
    }

    const users = await User.find(query)
      .select('-password -resetPasswordToken -emailVerificationToken')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get pending users for approval
router.get('/pending', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      status: 'pending',
      isEmailVerified: true 
    })
    .select('-password -resetPasswordToken -emailVerificationToken')
    .sort({ createdAt: -1 });

    res.json(pendingUsers);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ 
      message: 'Failed to fetch pending users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Approve user
router.post('/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status !== 'pending') {
      return res.status(400).json({ message: 'User is not pending approval' });
    }

    user.status = 'active';
    user.approvedBy = req.user._id;
    user.approvedAt = new Date();
    
    await user.save();

    // Send welcome email (implement email service)
    // await sendWelcomeEmail(user.email, user.name, user.userId);

    // Emit real-time notification to user
    const io = req.app.get('io');
    if (io) {
      io.to(user._id.toString()).emit('notification', {
        type: 'success',
        title: 'Account Approved',
        message: 'Your account has been approved. Welcome to Seereon CRM!',
        priority: 'high'
      });
    }

    res.json({
      message: 'User approved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ 
      message: 'Failed to approve user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Reject user
router.post('/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status !== 'pending') {
      return res.status(400).json({ message: 'User is not pending approval' });
    }

    // Instead of deleting, mark as inactive
    user.status = 'inactive';
    user.approvedBy = req.user._id;
    user.approvedAt = new Date();
    
    await user.save();

    // Send rejection email (implement email service)
    // await sendRejectionEmail(user.email, user.name, reason);

    res.json({
      message: 'User rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ 
      message: 'Failed to reject user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Users can only update their own profile unless they're admin
    if (userId !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allowedUpdates = [
      'name', 'phone', 'address', 'state', 'profilePhoto'
    ];

    // Admin can update additional fields
    if (req.user.role === 'Admin') {
      allowedUpdates.push('role', 'department', 'status');
    }

    // Update allowed fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    // Return user without sensitive data
    const updatedUser = await User.findById(userId)
      .select('-password -resetPasswordToken -emailVerificationToken');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      message: 'Failed to update user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update user status (Admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.json({
      message: 'User status updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ 
      message: 'Failed to update user status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get user statistics (Admin only)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const roleStats = await User.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const pendingUsers = await User.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      activeUsers,
      pendingUsers,
      statusBreakdown: stats,
      roleBreakdown: roleStats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;