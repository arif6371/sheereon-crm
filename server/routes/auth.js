import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate unique User ID
    let userId;
    let isUnique = false;
    while (!isUnique) {
      userId = User.generateUserId(name);
      const existingUserId = await User.findOne({ userId });
      if (!existingUserId) isUnique = true;
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = new User({
      userId,
      name,
      email,
      password,
      role,
      department,
      emailVerificationToken,
      emailVerificationExpires,
      status: 'pending'
    });

    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify Your Email - Seereon CRM',
      html: `
        <h2>Welcome to Seereon CRM!</h2>
        <p>Hello ${name},</p>
        <p>Your User ID is: <strong>${userId}</strong></p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="background: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>After email verification, your account will need admin approval before you can access the system.</p>
      `
    });

    res.status(201).json({
      message: 'Registration successful! Please check your email for verification.',
      userId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Verify Email
router.post('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Notify admins about new user pending approval
    const admins = await User.find({ role: 'Admin', status: 'active' });
    const io = req.app.get('io');
    
    admins.forEach(admin => {
      io.to(admin._id.toString()).emit('notification', {
        type: 'user_pending_approval',
        title: 'New User Pending Approval',
        message: `${user.name} (${user.userId}) has verified their email and is awaiting approval.`,
        data: { userId: user._id }
      });
    });

    res.json({ message: 'Email verified successfully! Awaiting admin approval.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Email verification failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check email verification
    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    // Check admin approval
    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending admin approval' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Your account has been deactivated' });
    }

    // Update online status
    user.onlineStatus = 'online';
    user.lastSeen = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        profilePhoto: user.profilePhoto,
        onlineStatus: user.onlineStatus
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Google OAuth Login
router.post('/google-login', async (req, res) => {
  try {
    const { googleId, email, name } = req.body;

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (!user) {
      // Create new user with Google OAuth
      let userId;
      let isUnique = false;
      while (!isUnique) {
        userId = User.generateUserId(name);
        const existingUserId = await User.findOne({ userId });
        if (!existingUserId) isUnique = true;
      }

      user = new User({
        userId,
        name,
        email,
        googleId,
        role: 'BDE', // Default role
        department: 'Sales',
        isEmailVerified: true,
        status: 'pending' // Still needs admin approval
      });

      await user.save();

      // Notify admins
      const admins = await User.find({ role: 'Admin', status: 'active' });
      const io = req.app.get('io');
      
      admins.forEach(admin => {
        io.to(admin._id.toString()).emit('notification', {
          type: 'user_pending_approval',
          title: 'New Google User Pending Approval',
          message: `${user.name} (${user.userId}) signed up with Google and is awaiting approval.`,
          data: { userId: user._id }
        });
      });

      return res.status(403).json({ 
        message: 'Account created successfully! Awaiting admin approval.',
        userId 
      });
    }

    // Check approval status
    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending admin approval' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Your account has been deactivated' });
    }

    // Update online status
    user.onlineStatus = 'online';
    user.lastSeen = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        profilePhoto: user.profilePhoto,
        onlineStatus: user.onlineStatus
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google login failed' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.onlineStatus = 'offline';
    user.lastSeen = new Date();
    await user.save();

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user data' });
  }
});

export default router;