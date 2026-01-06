// ========================================
// AUTHENTICATION API ROUTES
// ========================================
// MONGODB: Uncomment when ready to connect to database

const express = require('express');
const router = express.Router();

// MONGODB: Uncomment to import User model and dependencies
 const User = require('../models/User');
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken')
 
 const { OAuth2Client } = require('google-auth-library');
 const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Import security helper
const { checkEmailWhitelist } = require('../middleware/security');

// ========================================
// GOOGLE OAUTH LOGIN (Gmail Login)
// ========================================
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body; // Google ID token from frontend
    
    // GOOGLE OAUTH: Uncomment when ready to verify Google token
   
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    
    // Security: Check if email is in whitelist
    if (!checkEmailWhitelist(email)) {
      return res.status(403).json({ 
        error: 'Access Denied', 
        message: 'Your email domain is not authorized to access this admin panel' 
      });
    }
    
    // MONGODB: Check if user exists or create new one
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user from Google account
      user = new User({
        email,
        name,
        googleId,
        profilePicture: picture,
        role: 'admin', // First user is admin, or check email domain
        isActive: true,
        authProvider: 'google'
      });
      await user.save();
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.profilePicture,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error with Google login:', error);
    res.status(500).json({ error: 'Failed to login with Gmail', message: error.message });
  }
});

// ========================================
// REGISTER NEW USER
// ========================================
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
 
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: 'admin'
    });
    
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
   
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user', message: error.message });
  }
});

// ========================================
// LOGIN USER
// ========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
   
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login', message: error.message });
  }
});

// ========================================
// VERIFY TOKEN
// ========================================
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    res.json({
      message: 'Token valid',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
 
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token', message: error.message });
  }
});

// ========================================
// LOGOUT (Optional - mainly for token blacklisting)
// ========================================
router.post('/logout', async (req, res) => {
  try {
  
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      // Add token to blacklist
      const BlacklistedToken = require('../models/BlacklistedToken');
      await BlacklistedToken.create({ token });
    }
   
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Failed to logout', message: error.message });
  }
});

module.exports = router;