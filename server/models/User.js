import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    sparse: true
  },
  role: {
    type: String,
    enum: ['Admin', 'HR', 'PCF', 'BDE', 'DEV', 'DM', 'Accounts'],
    required: true
  },
  department: {
    type: String,
    required: true
  },
  phone: String,
  address: String,
  state: String,
  organization: {
    type: String,
    default: 'Seereon Consulting & IT Services'
  },
  profilePhoto: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'inactive'],
    default: 'pending'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  onlineStatus: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate User ID
userSchema.statics.generateUserId = function(name) {
  const initials = name.split(' ').map(n => n.charAt(0).toUpperCase()).join('');
  const year = new Date().getFullYear().toString().slice(-2);
  const serial = Math.floor(Math.random() * 999) + 1;
  return `${initials}-${year}-${serial.toString().padStart(3, '0')}`;
};

export default mongoose.model('User', userSchema);