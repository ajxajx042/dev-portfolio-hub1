const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');
const { authenticateToken, requireAdmin, logAuditEvent } = require('../middleware/auth');
const { idParamValidation } = require('../middleware/validation');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get dashboard statistics
router.get('/stats', (req, res) => {
  try {
    const db = getDb();

    const stats = {
      users: {
        total: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
        active: db.prepare('SELECT COUNT(*) as count FROM users WHERE is_active = 1').get().count,
        inactive: db.prepare('SELECT COUNT(*) as count FROM users WHERE is_active = 0').get().count,
        admins: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = \'admin\'').get().count
      },
      portfolios: {
        total: db.prepare('SELECT COUNT(*) as count FROM portfolios').get().count,
        published: db.prepare('SELECT COUNT(*) as count FROM portfolios WHERE is_published = 1').get().count,
        unpublished: db.prepare('SELECT COUNT(*) as count FROM portfolios WHERE is_published = 0').get().count,
        featured: db.prepare('SELECT COUNT(*) as count FROM portfolios WHERE is_featured = 1').get().count,
        totalViews: db.prepare('SELECT SUM(view_count) as total FROM portfolios').get().total || 0
      },
      projects: {
        total: db.prepare('SELECT COUNT(*) as count FROM projects').get().count
      },
      recentActivity: {
        usersLast7Days: db.prepare(`
          SELECT COUNT(*) as count 
          FROM users 
          WHERE created_at >= datetime('now', '-7 days')
        `).get().count,
        portfoliosLast7Days: db.prepare(`
          SELECT COUNT(*) as count 
          FROM portfolios 
          WHERE created_at >= datetime('now', '-7 days')
        `).get().count
      }
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Get all users (admin)
router.get('/users', (req, res) => {
  try {
    const db = getDb();
    const { page = 1, limit = 20, search, role, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, email, name, role, avatar_url, headline, 
             is_active, email_verified, created_at, last_login_at
      FROM users
      WHERE 1=1
    `;
    const params = [];

    // Search filter
    if (search) {
      query += ` AND (name LIKE ? OR email LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Role filter
    if (role) {
      query += ` AND role = ?`;
      params.push(role);
    }

    // Status filter
    if (status === 'active') {
      query += ` AND is_active = 1`;
    } else if (status === 'inactive') {
      query += ` AND is_active = 0`;
    }

    // Count total
    const countQuery = query.replace('SELECT id, email, name, role, avatar_url, headline, is_active, email_verified, created_at, last_login_at', 'SELECT COUNT(*) as total');
    const { total } = db.prepare(countQuery).get(...params);

    // Add ordering and pagination
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const users = db.prepare(query).all(...params);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get single user (admin)
router.get('/users/:id', idParamValidation, (req, res) => {
  try {
    const db = getDb();
    
    const user = db.prepare(`
      SELECT id, email, name, role, avatar_url, bio, headline, location,
             website, linkedin_url, github_url, twitter_url,
             is_active, email_verified, created_at, last_login_at
      FROM users
      WHERE id = ?
    `).get(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's portfolios
    const portfolios = db.prepare(`
      SELECT id, title, slug, is_published, is_featured, view_count, created_at
      FROM portfolios
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.params.id);

    res.json({
      user: {
        ...user,
        portfolios
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user (admin)
router.put('/users/:id', idParamValidation, (req, res) => {
  try {
    const db = getDb();
    const { role, isActive } = req.body;

    // Get current user
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from changing their own role
    if (req.params.id === req.user.id && role && role !== req.user.role) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    // Update user
    db.prepare(`
      UPDATE users
      SET role = COALESCE(?, role),
          is_active = COALESCE(?, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(role, isActive !== undefined ? (isActive ? 1 : 0) : null, req.params.id);

    // Log audit event
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    logAuditEvent(req.user.id, 'admin_user_updated', 'user', req.params.id, { role, isActive }, ipAddress, userAgent);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Get all portfolios (admin)
router.get('/portfolios', (req, res) => {
  try {
    const db = getDb();
    const { page = 1, limit = 20, search, status, featured } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, u.name as user_name, u.email as user_email
      FROM portfolios p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // Search filter
    if (search) {
      query += ` AND (p.title LIKE ? OR p.description LIKE ? OR u.name LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Status filter
    if (status === 'published') {
      query += ` AND p.is_published = 1`;
    } else if (status === 'unpublished') {
      query += ` AND p.is_published = 0`;
    }

    // Featured filter
    if (featured === 'true') {
      query += ` AND p.is_featured = 1`;
    } else if (featured === 'false') {
      query += ` AND p.is_featured = 0`;
    }

    // Count total
    const countQuery = query.replace('SELECT p.*, u.name as user_name, u.email as user_email', 'SELECT COUNT(*) as total');
    const { total } = db.prepare(countQuery).get(...params);

    // Add ordering and pagination
    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const portfolios = db.prepare(query).all(...params);

    const parsedPortfolios = portfolios.map(p => ({
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : []
    }));

    res.json({
      portfolios: parsedPortfolios,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get portfolios error:', error);
    res.status(500).json({ error: 'Failed to get portfolios' });
  }
});

// Update portfolio (admin)
router.put('/portfolios/:id', idParamValidation, (req, res) => {
  try {
    const db = getDb();
    const { isFeatured, isPublished } = req.body;

    // Get portfolio
    const portfolio = db.prepare('SELECT id FROM portfolios WHERE id = ?').get(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Handle publish status
    let publishedAt = null;
    if (isPublished !== undefined) {
      if (isPublished) {
        const existing = db.prepare('SELECT published_at FROM portfolios WHERE id = ?').get(req.params.id);
        publishedAt = existing.published_at || new Date().toISOString();
      }
    }

    db.prepare(`
      UPDATE portfolios
      SET is_featured = COALESCE(?, is_featured),
          is_published = COALESCE(?, is_published),
          published_at = COALESCE(?, published_at),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      isFeatured !== undefined ? (isFeatured ? 1 : 0) : null,
      isPublished !== undefined ? (isPublished ? 1 : 0) : null,
      publishedAt,
      req.params.id
    );

    // Log audit event
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    logAuditEvent(req.user.id, 'admin_portfolio_updated', 'portfolio', req.params.id, { isFeatured, isPublished }, ipAddress, userAgent);

    res.json({ message: 'Portfolio updated successfully' });
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

// Delete portfolio (admin)
router.delete('/portfolios/:id', idParamValidation, (req, res) => {
  try {
    const db = getDb();

    const portfolio = db.prepare('SELECT id FROM portfolios WHERE id = ?').get(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    db.prepare('DELETE FROM portfolios WHERE id = ?').run(req.params.id);

    // Log audit event
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    logAuditEvent(req.user.id, 'admin_portfolio_deleted', 'portfolio', req.params.id, {}, ipAddress, userAgent);

    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ error: 'Failed to delete portfolio' });
  }
});

// Get audit logs
router.get('/audit-logs', (req, res) => {
  try {
    const db = getDb();
    const { page = 1, limit = 50, userId, action, resourceType } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT al.*, u.name as user_name, u.email as user_email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      query += ` AND al.user_id = ?`;
      params.push(userId);
    }

    if (action) {
      query += ` AND al.action = ?`;
      params.push(action);
    }

    if (resourceType) {
      query += ` AND al.resource_type = ?`;
      params.push(resourceType);
    }

    // Count total
    const countQuery = query.replace('SELECT al.*, u.name as user_name, u.email as user_email', 'SELECT COUNT(*) as total');
    const { total } = db.prepare(countQuery).get(...params);

    query += ` ORDER BY al.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const logs = db.prepare(query).all(...params);

    const parsedLogs = logs.map(log => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : null
    }));

    res.json({
      logs: parsedLogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to get audit logs' });
  }
});

// Get categories (admin)
router.get('/categories', (req, res) => {
  try {
    const db = getDb();
    const categories = db.prepare(`
      SELECT * FROM categories
      ORDER BY sort_order ASC, name ASC
    `).all();

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

module.exports = router;
