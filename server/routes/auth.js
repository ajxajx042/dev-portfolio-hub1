const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db/database');
const { 
  hashPassword, 
  comparePassword, 
  generateToken,
  authenticateToken,
  createSession,
  logAuditEvent
} = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');

// Register new user
router.post('/register', registerValidation, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const db = getDb();

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = uuidv4();
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, is_active, email_verified)
      VALUES (?, ?, ?, ?, 'user', 1, 0)
    `).run(userId, email, passwordHash, name);

    // Generate token
    const token = generateToken(userId);

    // Create session
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    createSession(userId, ipAddress, userAgent);

    // Log audit event
    logAuditEvent(userId, 'user_registered', 'user', userId, { email, name }, ipAddress, userAgent);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email,
        name,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDb();

    // Find user
    const user = db.prepare(`
      SELECT id, email, password_hash, name, role, is_active 
      FROM users 
      WHERE email = ?
    `).get(email);

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(user.id);

    // Generate token
    const token = generateToken(user.id);

    // Create session
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    createSession(user.id, ipAddress, userAgent);

    // Log audit event
    logAuditEvent(user.id, 'user_login', 'user', user.id, { email }, ipAddress, userAgent);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const user = db.prepare(`
      SELECT id, email, name, role, avatar_url, bio, headline, location, 
             website, linkedin_url, github_url, twitter_url, created_at
      FROM users 
      WHERE id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    
    // Invalidate all sessions for this user
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(req.user.id);

    // Log audit event
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    logAuditEvent(req.user.id, 'user_logout', 'user', req.user.id, {}, ipAddress, userAgent);

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const db = getDb();

    // Get current user with password hash
    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(newPasswordHash, req.user.id);

    // Invalidate all sessions except current
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(req.user.id);

    // Generate new token
    const token = generateToken(req.user.id);

    // Create new session
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    createSession(req.user.id, ipAddress, userAgent);

    // Log audit event
    logAuditEvent(req.user.id, 'password_changed', 'user', req.user.id, {}, ipAddress, userAgent);

    res.json({
      message: 'Password changed successfully',
      token
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router;
