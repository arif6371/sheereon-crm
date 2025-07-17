import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  leadId: {
    type: String,
    unique: true,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'paid', 'pending', 'lost'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['Website', 'Referral', 'LinkedIn', 'Email', 'Phone', 'Other'],
    required: true
  },
  potentialValue: {
    type: Number,
    required: true
  },
  clientQuotation: Number,
  finalQuotation: Number,
  interestedPlatforms: [{
    type: String
  }],
  customPlatform: String,
  slaAgreed: {
    type: Boolean,
    default: false
  },
  ndaSigned: {
    type: Boolean,
    default: false
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedDate: Date,
  lastActivity: {
    type: Date,
    default: Date.now
  },
  followUpDate: Date,
  meetingScheduled: Date,
  projectNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  convertedToProject: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }
}, {
  timestamps: true
});

// Generate Lead ID
leadSchema.statics.generateLeadId = function() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 9999) + 1;
  return `LEAD-${year}${month}-${random.toString().padStart(4, '0')}`;
};

// Auto-update lastActivity on save
leadSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastActivity = new Date();
  }
  next();
});

export default mongoose.model('Lead', leadSchema);