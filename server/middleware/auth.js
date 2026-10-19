const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Hash password
async function hashPassword(password) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Compare password
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  const db = getDb();
  const user = db.prepare(`
    SELECT id, email, name, role, is_active 
    FROM users 
    WHERE id = ?
  `).get(decoded.userId);

  if (!user) {
    return res.status(403).json({ error: 'User not found' });
  }

  if (!user.is_active) {
    return res.status(403).json({ error: 'Account is deactivated' });
  }

  req.user = user;
  next();
}

// Optional authentication (doesn't fail if no token)
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      const db = getDb();
      const user = db.prepare(`
        SELECT id, email, name, role, is_active 
        FROM users 
        WHERE id = ?
      `).get(decoded.userId);

      if (user && user.is_active) {
        req.user = user;
      }
    }
  }

  next();
}

// Authorization middleware - require specific role
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Authorization middleware - require admin
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
}

// Authorization middleware - require owner or admin
function requireOwnerOrAdmin(resourceOwnerId) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Admin can access anything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    if (req.user.id === resourceOwnerId) {
      return next();
    }

    return res.status(403).json({ error: 'Access denied' });
  };
}

// Create session record
function createSession(userId, ipAddress, userAgent) {
  const db = getDb();
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  db.prepare(`
    INSERT INTO sessions (id, user_id, token_hash, ip_address, user_agent, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(sessionId, userId, 'hashed_token', ipAddress, userAgent, expiresAt);

  return sessionId;
}

// Clean expired sessions
function cleanExpiredSessions() {
  const db = getDb();
  const result = db.prepare(`
    DELETE FROM sessions WHERE expires_at < datetime('now')
  `).run();

  if (result.changes > 0) {
    console.log(`Cleaned ${result.changes} expired sessions`);
  }
}

// Log audit event
function logAuditEvent(userId, action, resourceType, resourceId, details, ipAddress, userAgent) {
  const db = getDb();
  const logId = uuidv4();

  db.prepare(`
    INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(logId, userId, action, resourceType, resourceId, JSON.stringify(details), ipAddress, userAgent);
}

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  authenticateToken,
  optionalAuth,
  requireRole,
  requireAdmin,
  requireOwnerOrAdmin,
  createSession,
  cleanExpiredSessions,
  logAuditEvent
};
