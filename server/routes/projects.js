import express from 'express';
import Project from '../models/Project.js';
import { authenticateToken, requireDev } from '../middleware/auth.js';

const router = express.Router();

// Get all projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    
    let query = {};
    
    // Role-based filtering
    if (req.user.role === 'DEV') {
      query['assignedTeam.user'] = req.user._id;
    }
    
    // Apply filters
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    const projects = await Project.find(query)
      .populate('assignedTeam.user', 'name email role')
      .populate('projectManager', 'name email')
      .populate('leadId', 'company contact email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      message: 'Failed to fetch projects',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create new project
router.post('/', authenticateToken, requireDev, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      client, 
      budget, 
      timeline, 
      technologies,
      assignedTeam,
      projectManager
    } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ 
        message: 'Name and description are required' 
      });
    }

    // Generate unique project ID
    const projectId = Project.generateProjectId();

    const project = new Project({
      projectId,
      name: name.trim(),
      description: description.trim(),
      client,
      budget,
      timeline,
      technologies: technologies || [],
      assignedTeam: assignedTeam || [],
      projectManager: projectManager || req.user._id
    });

    await project.save();
    await project.populate('assignedTeam.user', 'name email role');
    await project.populate('projectManager', 'name email');

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('project_created', {
        project,
        notification: {
          type: 'project_update',
          title: 'New Project Created',
          message: `Project ${project.name} has been created`,
          priority: 'medium'
        }
      });
    }

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ 
      message: 'Failed to create project',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    const isProjectManager = project.projectManager?.toString() === req.user._id.toString();
    const isTeamMember = project.assignedTeam.some(
      member => member.user?.toString() === req.user._id.toString()
    );
    const isAdmin = req.user.role === 'Admin';

    if (!isProjectManager && !isTeamMember && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const allowedUpdates = [
      'name', 'description', 'status', 'priority', 'progress',
      'budget', 'timeline', 'technologies'
    ];

    // Update allowed fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ 
      message: 'Failed to update project',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Add project update
router.post('/:id/updates', authenticateToken, async (req, res) => {
  try {
    const { title, description, visibility } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.updates.push({
      title: title.trim(),
      description: description.trim(),
      postedBy: req.user._id,
      visibility: visibility || 'internal'
    });

    await project.save();

    res.json({
      message: 'Project update added successfully',
      project
    });
  } catch (error) {
    console.error('Error adding project update:', error);
    res.status(500).json({ 
      message: 'Failed to add project update',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Add task to project
router.post('/:id/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, assignedTo, priority, estimatedHours, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.tasks.push({
      title: title.trim(),
      description: description?.trim(),
      assignedTo,
      priority: priority || 'medium',
      estimatedHours,
      dueDate: dueDate ? new Date(dueDate) : null
    });

    await project.save();

    res.json({
      message: 'Task added successfully',
      project
    });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ 
      message: 'Failed to add task',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update task status
router.put('/:id/tasks/:taskId', authenticateToken, async (req, res) => {
  try {
    const { status, actualHours } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = project.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (status) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
      }
    }

    if (actualHours !== undefined) {
      task.actualHours = actualHours;
    }

    await project.save();

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ 
      message: 'Failed to update task',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get project statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    let matchQuery = {};
    
    // Role-based filtering
    if (req.user.role === 'DEV') {
      matchQuery['assignedTeam.user'] = req.user._id;
    }

    const stats = await Project.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalBudget: { $sum: '$budget.allocated' }
        }
      }
    ]);

    const totalProjects = await Project.countDocuments(matchQuery);
    const avgProgress = await Project.aggregate([
      { $match: matchQuery },
      { $group: { _id: null, avgProgress: { $avg: '$progress' } } }
    ]);

    res.json({
      totalProjects,
      averageProgress: avgProgress[0]?.avgProgress || 0,
      statusBreakdown: stats,
      totalBudget: stats.reduce((sum, stat) => sum + stat.totalBudget, 0)
    });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch project statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;