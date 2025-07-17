import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  client: {
    company: String,
    contact: String,
    email: String,
    phone: String
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  budget: {
    allocated: Number,
    spent: {
      type: Number,
      default: 0
    }
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    estimatedHours: Number,
    actualHours: {
      type: Number,
      default: 0
    }
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  assignedTeam: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['Project Manager', 'Lead Developer', 'Developer', 'Designer', 'Tester']
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  }],
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  technologies: [String],
  milestones: [{
    title: String,
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'overdue'],
      default: 'pending'
    },
    completedAt: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  tasks: [{
    title: String,
    description: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'completed'],
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    estimatedHours: Number,
    actualHours: Number,
    dueDate: Date,
    createdAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date
  }],
  updates: [{
    title: String,
    description: String,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    postedAt: {
      type: Date,
      default: Date.now
    },
    attachments: [String],
    visibility: {
      type: String,
      enum: ['team', 'client', 'internal'],
      default: 'internal'
    }
  }],
  issues: [{
    title: String,
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open'
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: Date,
    resolution: String
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    access: {
      type: String,
      enum: ['team', 'client', 'admin'],
      default: 'team'
    }
  }]
}, {
  timestamps: true
});

// Generate Project ID
projectSchema.statics.generateProjectId = function() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 9999) + 1;
  return `PROJ-${year}${month}-${random.toString().padStart(4, '0')}`;
};

export default mongoose.model('Project', projectSchema);