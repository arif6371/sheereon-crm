import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    time: Date,
    location: String,
    ipAddress: String
  },
  checkOut: {
    time: Date,
    location: String,
    ipAddress: String
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day', 'work-from-home'],
    default: 'present'
  },
  workingHours: {
    type: Number,
    default: 0
  },
  breaks: [{
    startTime: Date,
    endTime: Date,
    duration: Number,
    reason: String
  }],
  overtime: {
    hours: {
      type: Number,
      default: 0
    },
    approved: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  notes: String,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index for user and date
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

// Calculate working hours before saving
attendanceSchema.pre('save', function(next) {
  if (this.checkIn.time && this.checkOut.time) {
    const diffMs = this.checkOut.time - this.checkIn.time;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // Subtract break time
    const totalBreakTime = this.breaks.reduce((total, breakItem) => {
      if (breakItem.endTime && breakItem.startTime) {
        return total + (breakItem.endTime - breakItem.startTime);
      }
      return total;
    }, 0);
    
    this.workingHours = Math.max(0, diffHours - (totalBreakTime / (1000 * 60 * 60)));
  }
  next();
});

export default mongoose.model('Attendance', attendanceSchema);