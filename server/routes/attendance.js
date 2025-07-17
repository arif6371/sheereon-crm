import express from 'express';
import Attendance from '../models/Attendance.js';
import { authenticateToken, requireHR } from '../middleware/auth.js';

const router = express.Router();

// Get attendance records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { date, userId, status } = req.query;
    
    let query = {};
    
    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      query.date = {
        $gte: startDate,
        $lt: endDate
      };
    }
    
    // Filter by user if provided
    if (userId) {
      query.user = userId;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Role-based filtering
    if (req.user.role !== 'Admin' && req.user.role !== 'HR') {
      query.user = req.user._id;
    }

    const attendance = await Attendance.find(query)
      .populate('user', 'name userId department')
      .populate('approvedBy', 'name')
      .sort({ date: -1, 'checkIn.time': -1 })
      .limit(100);

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ 
      message: 'Failed to fetch attendance records',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Mark attendance (check-in/check-out)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, location, notes } = req.body; // type: 'checkin' or 'checkout'
    
    if (!type || !['checkin', 'checkout'].includes(type)) {
      return res.status(400).json({ message: 'Valid type (checkin/checkout) is required' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let attendance = await Attendance.findOne({
      user: req.user._id,
      date: { $gte: today }
    });

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 8);
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (type === 'checkin') {
      if (attendance && attendance.checkIn.time) {
        return res.status(400).json({ message: 'Already checked in today' });
      }

      if (!attendance) {
        attendance = new Attendance({
          user: req.user._id,
          date: today
        });
      }

      attendance.checkIn = {
        time: now,
        location: location || 'Office',
        ipAddress
      };

      // Determine status based on check-in time
      const checkInHour = now.getHours();
      const checkInMinute = now.getMinutes();
      
      if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 15)) {
        attendance.status = 'late';
      } else {
        attendance.status = 'present';
      }

      if (notes) {
        attendance.notes = notes;
      }

      await attendance.save();

      // Emit real-time notification to HR
      const io = req.app.get('io');
      if (io) {
        io.to('role_hr').emit('attendance_update', {
          type: 'checkin',
          user: {
            name: req.user.name,
            userId: req.user.userId
          },
          time: currentTime,
          status: attendance.status
        });
      }

      res.json({
        message: 'Check-in recorded successfully',
        attendance
      });

    } else if (type === 'checkout') {
      if (!attendance || !attendance.checkIn.time) {
        return res.status(400).json({ message: 'Must check in before checking out' });
      }

      if (attendance.checkOut.time) {
        return res.status(400).json({ message: 'Already checked out today' });
      }

      attendance.checkOut = {
        time: now,
        location: location || 'Office',
        ipAddress
      };

      await attendance.save();

      // Emit real-time notification to HR
      const io = req.app.get('io');
      if (io) {
        io.to('role_hr').emit('attendance_update', {
          type: 'checkout',
          user: {
            name: req.user.name,
            userId: req.user.userId
          },
          time: currentTime,
          workingHours: attendance.workingHours
        });
      }

      res.json({
        message: 'Check-out recorded successfully',
        attendance
      });
    }
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ 
      message: 'Failed to record attendance',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update attendance (HR/Admin only)
router.put('/:id', authenticateToken, requireHR, async (req, res) => {
  try {
    const { status, notes, workingHours } = req.body;
    
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (status) {
      attendance.status = status;
    }
    
    if (notes) {
      attendance.notes = notes;
    }
    
    if (workingHours !== undefined) {
      attendance.workingHours = workingHours;
    }

    attendance.approvedBy = req.user._id;
    await attendance.save();

    res.json({
      message: 'Attendance updated successfully',
      attendance
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ 
      message: 'Failed to update attendance',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get attendance statistics
router.get('/stats', authenticateToken, requireHR, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateQuery = {};
    if (startDate && endDate) {
      dateQuery = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      // Default to current month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      dateQuery = {
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      };
    }

    const stats = await Attendance.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRecords = await Attendance.countDocuments(dateQuery);
    const avgWorkingHours = await Attendance.aggregate([
      { $match: { ...dateQuery, workingHours: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          avgHours: { $avg: '$workingHours' }
        }
      }
    ]);

    res.json({
      totalRecords,
      statusBreakdown: stats,
      averageWorkingHours: avgWorkingHours[0]?.avgHours || 0
    });
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch attendance statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;