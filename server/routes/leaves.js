import express from 'express';
import Leave from '../models/Leave.js';
import { authenticateToken, requireHR } from '../middleware/auth.js';

const router = express.Router();

// Get leave requests
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, type, employeeId } = req.query;
    
    let query = {};
    
    // Role-based filtering
    if (req.user.role !== 'Admin' && req.user.role !== 'HR') {
      query.employee = req.user._id;
    }
    
    // Apply filters
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (employeeId) {
      query.employee = employeeId;
    }

    const leaves = await Leave.find(query)
      .populate('employee', 'name userId department')
      .populate('reviewedBy', 'name')
      .populate('coveringEmployee', 'name userId')
      .sort({ appliedDate: -1 })
      .limit(100);

    res.json(leaves);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ 
      message: 'Failed to fetch leave requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Apply for leave
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      type, 
      startDate, 
      endDate, 
      reason, 
      emergencyContact, 
      handoverNotes, 
      coveringEmployee 
    } = req.body;

    // Validate required fields
    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ 
        message: 'Type, start date, end date, and reason are required' 
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({ 
        message: 'End date must be after start date' 
      });
    }

    // Check for overlapping leave requests
    const overlapping = await Leave.findOne({
      employee: req.user._id,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ 
        message: 'You have an overlapping leave request' 
      });
    }

    const leave = new Leave({
      employee: req.user._id,
      type,
      startDate: start,
      endDate: end,
      reason: reason.trim(),
      emergencyContact,
      handoverNotes: handoverNotes?.trim(),
      coveringEmployee
    });

    await leave.save();
    await leave.populate('employee', 'name userId department');

    // Notify HR about new leave request
    const io = req.app.get('io');
    if (io) {
      io.to('role_hr').emit('leave_request', {
        type: 'new_request',
        leave: {
          id: leave._id,
          employee: leave.employee.name,
          type: leave.type,
          days: leave.days,
          startDate: leave.startDate,
          endDate: leave.endDate
        },
        notification: {
          type: 'info',
          title: 'New Leave Request',
          message: `${leave.employee.name} applied for ${leave.type} leave`,
          priority: 'medium'
        }
      });
    }

    res.status(201).json({
      message: 'Leave request submitted successfully',
      leave
    });
  } catch (error) {
    console.error('Error applying for leave:', error);
    res.status(500).json({ 
      message: 'Failed to submit leave request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Review leave request (HR/Admin only)
router.put('/:id/review', authenticateToken, requireHR, async (req, res) => {
  try {
    const { status, reviewComments } = req.body;
    
    if (!['approved', 'denied'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or denied' });
    }

    const leave = await Leave.findById(req.params.id)
      .populate('employee', 'name userId email');
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Leave request already reviewed' });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    leave.reviewComments = reviewComments?.trim();

    await leave.save();

    // Notify employee about leave decision
    const io = req.app.get('io');
    if (io) {
      io.to(leave.employee._id.toString()).emit('leave_decision', {
        type: status,
        leave: {
          id: leave._id,
          type: leave.type,
          startDate: leave.startDate,
          endDate: leave.endDate,
          status: leave.status
        },
        notification: {
          type: status === 'approved' ? 'success' : 'warning',
          title: `Leave Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          message: `Your ${leave.type} leave request has been ${status}`,
          priority: 'high'
        }
      });
    }

    res.json({
      message: `Leave request ${status} successfully`,
      leave
    });
  } catch (error) {
    console.error('Error reviewing leave request:', error);
    res.status(500).json({ 
      message: 'Failed to review leave request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Cancel leave request
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Check if user can cancel this leave
    if (leave.employee.toString() !== req.user._id.toString() && 
        req.user.role !== 'Admin' && req.user.role !== 'HR') {
      return res.status(403).json({ message: 'Not authorized to cancel this leave request' });
    }

    if (leave.status === 'cancelled') {
      return res.status(400).json({ message: 'Leave request already cancelled' });
    }

    leave.status = 'cancelled';
    await leave.save();

    res.json({
      message: 'Leave request cancelled successfully',
      leave
    });
  } catch (error) {
    console.error('Error cancelling leave request:', error);
    res.status(500).json({ 
      message: 'Failed to cancel leave request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get leave statistics
router.get('/stats', authenticateToken, requireHR, async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    const stats = await Leave.aggregate([
      {
        $match: {
          appliedDate: {
            $gte: startOfYear,
            $lte: endOfYear
          }
        }
      },
      {
        $group: {
          _id: {
            status: '$status',
            type: '$type'
          },
          count: { $sum: 1 },
          totalDays: { $sum: '$days' }
        }
      }
    ]);

    const totalRequests = await Leave.countDocuments({
      appliedDate: {
        $gte: startOfYear,
        $lte: endOfYear
      }
    });

    const pendingRequests = await Leave.countDocuments({
      status: 'pending',
      appliedDate: {
        $gte: startOfYear,
        $lte: endOfYear
      }
    });

    res.json({
      totalRequests,
      pendingRequests,
      breakdown: stats,
      year: currentYear
    });
  } catch (error) {
    console.error('Error fetching leave stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch leave statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;