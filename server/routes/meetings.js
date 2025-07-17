import express from 'express';
import Meeting from '../models/Meeting.js';
import { authenticateToken, requireHR } from '../middleware/auth.js';

const router = express.Router();

// Get all meetings/events
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { date, type, status } = req.query;
    
    let query = {};
    
    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      query.startTime = {
        $gte: startDate,
        $lt: endDate
      };
    }
    
    // Filter by type
    if (type) {
      query.type = type;
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }

    const meetings = await Meeting.find(query)
      .populate('organizer', 'name email role')
      .populate('attendees.user', 'name email role')
      .sort({ startTime: 1 })
      .limit(100);

    // Transform meetings to match frontend event structure
    const events = meetings.map(meeting => ({
      id: meeting._id,
      title: meeting.title,
      description: meeting.description,
      type: meeting.type,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      location: meeting.location,
      meetingLink: meeting.meetingLink,
      attendees: meeting.attendees.map(a => a.user?.name || 'Unknown'),
      organizer: {
        name: meeting.organizer?.name || 'Unknown',
        id: meeting.organizer?._id || ''
      },
      status: meeting.status
    }));

    res.json(events);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ 
      message: 'Failed to fetch meetings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create new meeting/event
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, type, startTime, endTime, location, meetingLink, attendees } = req.body;

    // Validate required fields
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ 
        message: 'Title, start time, and end time are required' 
      });
    }

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      return res.status(400).json({ 
        message: 'End time must be after start time' 
      });
    }

    const meeting = new Meeting({
      title: title.trim(),
      description: description?.trim(),
      type: type || 'meeting',
      startTime: start,
      endTime: end,
      location: location || 'office',
      meetingLink: meetingLink?.trim(),
      organizer: req.user._id,
      attendees: attendees ? attendees.map(id => ({ user: id })) : []
    });

    await meeting.save();
    await meeting.populate('organizer', 'name email role');
    await meeting.populate('attendees.user', 'name email role');

    // Emit real-time notification to all users
    const io = req.app.get('io');
    if (io) {
      io.emit('new_event', {
        event: {
          id: meeting._id,
          title: meeting.title,
          description: meeting.description,
          type: meeting.type,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          location: meeting.location,
          organizer: {
            name: meeting.organizer.name,
            id: meeting.organizer._id
          },
          status: meeting.status
        },
        notification: {
          type: 'info',
          title: 'New Event Scheduled',
          message: `${meeting.title} scheduled for ${start.toLocaleDateString()}`,
          priority: 'medium'
        }
      });
    }

    res.status(201).json({
      message: 'Meeting scheduled successfully',
      meeting: {
        id: meeting._id,
        title: meeting.title,
        description: meeting.description,
        type: meeting.type,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        location: meeting.location,
        organizer: {
          name: meeting.organizer.name,
          id: meeting.organizer._id
        },
        status: meeting.status
      }
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ 
      message: 'Failed to create meeting',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update meeting status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['scheduled', 'ongoing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check if user is organizer or admin
    if (meeting.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this meeting' });
    }

    meeting.status = status;
    await meeting.save();

    res.json({ message: 'Meeting status updated successfully' });
  } catch (error) {
    console.error('Error updating meeting status:', error);
    res.status(500).json({ 
      message: 'Failed to update meeting status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// RSVP to meeting
router.post('/:id/rsvp', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body; // accepted, declined, tentative
    
    if (!['accepted', 'declined', 'tentative'].includes(status)) {
      return res.status(400).json({ message: 'Invalid RSVP status' });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Find attendee and update status
    const attendeeIndex = meeting.attendees.findIndex(
      a => a.user.toString() === req.user._id.toString()
    );

    if (attendeeIndex === -1) {
      // Add user as attendee if not already
      meeting.attendees.push({
        user: req.user._id,
        status,
        responseAt: new Date()
      });
    } else {
      // Update existing attendee status
      meeting.attendees[attendeeIndex].status = status;
      meeting.attendees[attendeeIndex].responseAt = new Date();
    }

    await meeting.save();

    res.json({ message: 'RSVP updated successfully' });
  } catch (error) {
    console.error('Error updating RSVP:', error);
    res.status(500).json({ 
      message: 'Failed to update RSVP',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;