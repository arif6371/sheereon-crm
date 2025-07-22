import express from 'express';
import Lead from '../models/Lead.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import { authenticateToken, requireSales, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all leads
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, priority, assignedTo, search } = req.query;
    
    let query = {};
    
    // Role-based filtering
    if (req.user.role === 'SALES') {
      query.assignedTo = req.user._id;
    }
    
    // Apply filters
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ 
      message: 'Failed to fetch leads',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create new lead
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      company, 
      industry, 
      contact, 
      email, 
      phone, 
      source, 
      potentialValue, 
      priority,
      interestedPlatforms,
      customPlatform
    } = req.body;

    // Validate required fields
    if (!company || !industry || !contact || !email || !phone || !source || !potentialValue) {
      return res.status(400).json({ 
        message: 'All required fields must be provided' 
      });
    }

    // Generate unique lead ID
    const leadId = Lead.generateLeadId();

    const lead = new Lead({
      leadId,
      company: company.trim(),
      industry: industry.trim(),
      contact: contact.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      source,
      potentialValue: parseFloat(potentialValue),
      priority: priority || 'medium',
      interestedPlatforms: interestedPlatforms || [],
      customPlatform: customPlatform?.trim()
    });

    await lead.save();

    // Add to status history
    lead.statusHistory.push({
      status: 'new',
      changedBy: req.user._id,
      reason: 'Lead created'
    });

    // Add initial project note
    lead.projectNotes.push({
      note: 'Lead created and ready for assignment',
      addedBy: req.user._id
    });

    await lead.save();

    res.status(201).json({
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ 
      message: 'Failed to create lead',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Assign lead to BDE
router.post('/assign', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { leadIds, assignTo } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ message: 'Lead IDs array is required' });
    }

    if (!assignTo) {
      return res.status(400).json({ message: 'Assign to user ID is required' });
    }

    const leads = await Lead.find({ _id: { $in: leadIds } });
    
    if (leads.length !== leadIds.length) {
      return res.status(404).json({ message: 'Some leads not found' });
    }

    // Update leads
    const updatePromises = leads.map(async (lead) => {
      lead.assignedTo = assignTo;
      lead.assignedBy = req.user._id;
      lead.assignedDate = new Date();
      lead.lastActivity = new Date();
      
      // Add to status history
      lead.statusHistory.push({
        status: lead.status,
        changedBy: req.user._id,
        reason: 'Lead assigned to BDE'
      });

      // Add project note
      lead.projectNotes.push({
        note: `Lead assigned to BDE for follow-up`,
        addedBy: req.user._id
      });

      await lead.save();

      // Create notification for assigned user
      await Notification.create({
        recipient: assignTo,
        sender: req.user._id,
        type: 'lead_assigned',
        title: 'New Lead Assigned',
        message: `You have been assigned lead: ${lead.company}`,
        data: { leadId: lead._id },
        priority: 'high'
      });

      return lead;
    });

    await Promise.all(updatePromises);

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(assignTo.toString()).emit('notification', {
        type: 'lead_assigned',
        title: 'New Leads Assigned',
        message: `${leads.length} lead(s) have been assigned to you`,
        priority: 'high'
      });
    }

    res.json({
      message: `${leads.length} lead(s) assigned successfully`
    });
  } catch (error) {
    console.error('Error assigning leads:', error);
    res.status(500).json({ 
      message: 'Failed to assign leads',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update lead status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    const validStatuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'paid', 'pending', 'lost'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check permissions
    if (req.user.role === 'SALES' && lead.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update leads assigned to you' });
    }

    const oldStatus = lead.status;
    lead.status = status;
    lead.lastActivity = new Date();

    // Add to status history
    lead.statusHistory.push({
      status,
      changedBy: req.user._id,
      reason: reason || `Status changed from ${oldStatus} to ${status}`
    });

    // Add project note
    lead.projectNotes.push({
      note: `Status updated to ${status}${reason ? `: ${reason}` : ''}`,
      addedBy: req.user._id
    });

    await lead.save();

    // If status is 'paid', convert to project
    if (status === 'paid' && !lead.convertedToProject) {
      try {
        const projectId = Project.generateProjectId();
        
        const project = new Project({
          projectId,
          name: `${lead.company} - ${lead.interestedPlatforms.join(', ')}`,
          description: `Project converted from lead ${lead.leadId}`,
          client: {
            company: lead.company,
            contact: lead.contact,
            email: lead.email,
            phone: lead.phone
          },
          leadId: lead._id,
          budget: {
            allocated: lead.finalQuotation || lead.potentialValue
          },
          timeline: {
            startDate: new Date()
          },
          technologies: lead.interestedPlatforms
        });

        await project.save();

        // Update lead
        lead.convertedToProject = true;
        lead.projectId = project._id;
        await lead.save();

        // Notify development team
        const io = req.app.get('io');
        if (io) {
          io.emit('project_created', {
            project,
            notification: {
              type: 'project_update',
              title: 'New Project Created',
              message: `Lead ${lead.company} converted to project`,
              priority: 'high'
            }
          });
        }
      } catch (projectError) {
        console.error('Error creating project from lead:', projectError);
        // Continue with lead update even if project creation fails
      }
    }

    res.json({
      message: 'Lead status updated successfully',
      lead
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({ 
      message: 'Failed to update lead status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update lead details
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check permissions
    if (req.user.role === 'SALES' && lead.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update leads assigned to you' });
    }

    const allowedUpdates = [
      'company', 'industry', 'contact', 'email', 'phone', 'priority',
      'clientQuotation', 'finalQuotation', 'interestedPlatforms', 
      'customPlatform', 'slaAgreed', 'ndaSigned', 'followUpDate', 
      'meetingScheduled'
    ];

    // Update allowed fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        lead[field] = req.body[field];
      }
    });

    lead.lastActivity = new Date();
    await lead.save();

    res.json({
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ 
      message: 'Failed to update lead',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Add project note
router.post('/:id/notes', authenticateToken, async (req, res) => {
  try {
    const { note } = req.body;
    
    if (!note || !note.trim()) {
      return res.status(400).json({ message: 'Note content is required' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check permissions
    if (req.user.role === 'SALES' && lead.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only add notes to leads assigned to you' });
    }

    lead.projectNotes.push({
      note: note.trim(),
      addedBy: req.user._id
    });

    lead.lastActivity = new Date();
    await lead.save();

    res.json({
      message: 'Note added successfully',
      lead
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ 
      message: 'Failed to add note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get lead statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    let matchQuery = {};
    
    // Role-based filtering
    if (req.user.role === 'BDE') {
      matchQuery.assignedTo = req.user._id;
    }

    const stats = await Lead.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$potentialValue' }
        }
      }
    ]);

    const totalLeads = await Lead.countDocuments(matchQuery);
    const conversionRate = totalLeads > 0 ? 
      ((stats.find(s => s._id === 'paid')?.count || 0) / totalLeads * 100).toFixed(1) : 0;

    res.json({
      totalLeads,
      conversionRate: parseFloat(conversionRate),
      statusBreakdown: stats,
      totalPipelineValue: stats.reduce((sum, stat) => sum + stat.totalValue, 0)
    });
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch lead statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;