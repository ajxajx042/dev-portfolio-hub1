const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db/database');
const { authenticateToken, optionalAuth, logAuditEvent } = require('../middleware/auth');
const { 
  createPortfolioValidation, 
  updatePortfolioValidation,
  idParamValidation,
  slugParamValidation,
  searchValidation
} = require('../middleware/validation');

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

// Ensure unique slug
function ensureUniqueSlug(db, slug, excludeId = null) {
  let uniqueSlug = slug;
  let counter = 1;
  
  while (true) {
    const query = excludeId 
      ? 'SELECT id FROM portfolios WHERE slug = ? AND id != ?'
      : 'SELECT id FROM portfolios WHERE slug = ?';
    
    const params = excludeId ? [uniqueSlug, excludeId] : [uniqueSlug];
    const existing = db.prepare(query).get(...params);
    
    if (!existing) {
      return uniqueSlug;
    }
    
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
}

// Get all published portfolios (public)
router.get('/', searchValidation, optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const { q, category, page = 1, limit = 20, sort = 'recent' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, u.name as user_name, u.headline as user_headline, u.avatar_url as user_avatar
      FROM portfolios p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_published = 1 AND u.is_active = 1
    `;
    const params = [];

    // Search filter
    if (q) {
      query += ` AND (p.title LIKE ? OR p.description LIKE ? OR u.name LIKE ?)`;
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Category filter
    if (category) {
      query += ` AND p.category = ?`;
      params.push(category);
    }

    // Sorting
    if (sort === 'popular') {
      query += ` ORDER BY p.view_count DESC, p.published_at DESC`;
    } else if (sort === 'featured') {
      query += ` ORDER BY p.is_featured DESC, p.published_at DESC`;
    } else {
      query += ` ORDER BY p.published_at DESC`;
    }

    // Pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const portfolios = db.prepare(query).all(...params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM portfolios p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_published = 1 AND u.is_active = 1
    `;
    const countParams = [];

    if (q) {
      countQuery += ` AND (p.title LIKE ? OR p.description LIKE ? OR u.name LIKE ?)`;
      const searchTerm = `%${q}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (category) {
      countQuery += ` AND p.category = ?`;
      countParams.push(category);
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    // Parse tags JSON
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

// Get portfolio by slug (public)
router.get('/slug/:slug', slugParamValidation, optionalAuth, (req, res) => {
  try {
    const db = getDb();
    
    const portfolio = db.prepare(`
      SELECT p.*, u.name as user_name, u.headline as user_headline, 
             u.avatar_url as user_avatar, u.bio as user_bio,
             u.location as user_location, u.website as user_website,
             u.linkedin_url as user_linkedin, u.github_url as user_github,
             u.twitter_url as user_twitter
      FROM portfolios p
      JOIN users u ON p.user_id = u.id
      WHERE p.slug = ? AND u.is_active = 1
    `).get(req.params.slug);

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Check if user can view this portfolio
    const isOwner = req.user && req.user.id === portfolio.user_id;
    const isAdmin = req.user && req.user.role === 'admin';
    
    if (!portfolio.is_published && !isOwner && !isAdmin) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Increment view count (only for published portfolios and non-owners)
    if (portfolio.is_published && !isOwner) {
      db.prepare('UPDATE portfolios SET view_count = view_count + 1 WHERE id = ?')
        .run(portfolio.id);
    }

    // Get portfolio projects
    const projects = db.prepare(`
      SELECT * FROM projects
      WHERE portfolio_id = ?
      ORDER BY sort_order ASC, created_at DESC
    `).all(portfolio.id);

    // Get user skills
    const skills = db.prepare(`
      SELECT name, category, proficiency_level
      FROM skills
      WHERE user_id = ?
      ORDER BY proficiency_level DESC
    `).all(portfolio.user_id);

    // Get user experience
    const experience = db.prepare(`
      SELECT company, position, description, start_date, end_date, is_current
      FROM experience
      WHERE user_id = ?
      ORDER BY 
        CASE WHEN is_current = 1 THEN 0 ELSE 1 END,
        start_date DESC
    `).all(portfolio.user_id);

    // Parse JSON fields
    const parsedPortfolio = {
      ...portfolio,
      tags: portfolio.tags ? JSON.parse(portfolio.tags) : [],
      projects: projects.map(p => ({
        ...p,
        technologies: p.technologies ? JSON.parse(p.technologies) : []
      })),
      user: {
        name: portfolio.user_name,
        headline: portfolio.user_headline,
        avatar_url: portfolio.user_avatar,
        bio: portfolio.user_bio,
        location: portfolio.user_location,
        website: portfolio.user_website,
        linkedin_url: portfolio.user_linkedin,
        github_url: portfolio.user_github,
        twitter_url: portfolio.user_twitter,
        skills,
        experience
      }
    };

    // Remove duplicate fields
    delete parsedPortfolio.user_name;
    delete parsedPortfolio.user_headline;
    delete parsedPortfolio.user_avatar;
    delete parsedPortfolio.user_bio;
    delete parsedPortfolio.user_location;
    delete parsedPortfolio.user_website;
    delete parsedPortfolio.user_linkedin;
    delete parsedPortfolio.user_github;
    delete parsedPortfolio.user_twitter;

    res.json({ portfolio: parsedPortfolio });
  } catch (error) {
    console.error('Get portfolio by slug error:', error);
    res.status(500).json({ error: 'Failed to get portfolio' });
  }
});

// Get user's portfolios (authenticated)
router.get('/my', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    
    const portfolios = db.prepare(`
      SELECT * FROM portfolios
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `).all(req.user.id);

    const parsedPortfolios = portfolios.map(p => ({
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : []
    }));

    res.json({ portfolios: parsedPortfolios });
  } catch (error) {
    console.error('Get my portfolios error:', error);
    res.status(500).json({ error: 'Failed to get portfolios' });
  }
});

// Get single portfolio by ID (authenticated)
router.get('/:id', authenticateToken, idParamValidation, (req, res) => {
  try {
    const db = getDb();
    
    const portfolio = db.prepare(`
      SELECT * FROM portfolios
      WHERE id = ?
    `).get(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Check ownership or admin access
    if (portfolio.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get projects
    const projects = db.prepare(`
      SELECT * FROM projects
      WHERE portfolio_id = ?
      ORDER BY sort_order ASC, created_at DESC
    `).all(portfolio.id);

    const parsedPortfolio = {
      ...portfolio,
      tags: portfolio.tags ? JSON.parse(portfolio.tags) : [],
      projects: projects.map(p => ({
        ...p,
        technologies: p.technologies ? JSON.parse(p.technologies) : []
      }))
    };

    res.json({ portfolio: parsedPortfolio });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Failed to get portfolio' });
  }
});

// Create portfolio
router.post('/', authenticateToken, createPortfolioValidation, (req, res) => {
  try {
    const db = getDb();
    const { title, description, category, tags, isPublished } = req.body;

    const portfolioId = uuidv4();
    let slug = generateSlug(title);
    slug = ensureUniqueSlug(db, slug);

    const publishedAt = isPublished ? new Date().toISOString() : null;

    db.prepare(`
      INSERT INTO portfolios (id, user_id, title, slug, description, category, tags, is_published, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      portfolioId,
      req.user.id,
      title,
      slug,
      description,
      category,
      JSON.stringify(tags || []),
      isPublished ? 1 : 0,
      publishedAt
    );

    // Log audit event
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    logAuditEvent(req.user.id, 'portfolio_created', 'portfolio', portfolioId, { title, slug }, ipAddress, userAgent);

    res.status(201).json({
      message: 'Portfolio created successfully',
      portfolioId,
      slug
    });
  } catch (error) {
    console.error('Create portfolio error:', error);
    res.status(500).json({ error: 'Failed to create portfolio' });
  }
});

// Update portfolio
router.put('/:id', authenticateToken, updatePortfolioValidation, (req, res) => {
  try {
    const db = getDb();
    const { title, description, category, tags, isPublished } = req.body;

    // Get existing portfolio
    const portfolio = db.prepare('SELECT * FROM portfolios WHERE id = ?').get(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Check ownership or admin access
    if (portfolio.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Generate new slug if title changed
    let slug = portfolio.slug;
    if (title && title !== portfolio.title) {
      slug = generateSlug(title);
      slug = ensureUniqueSlug(db, slug, req.params.id);
    }

    // Handle publish status
    let publishedAt = portfolio.published_at;
    if (isPublished !== undefined) {
      if (isPublished && !portfolio.is_published) {
        publishedAt = new Date().toISOString();
      } else if (!isPublished) {
        publishedAt = null;
      }
    }

    db.prepare(`
      UPDATE portfolios
      SET title = COALESCE(?, title),
          slug = ?,
          description = COALESCE(?, description),
          category = COALESCE(?, category),
          tags = COALESCE(?, tags),
          is_published = COALESCE(?, is_published),
          published_at = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title,
      slug,
      description,
      category,
      tags ? JSON.stringify(tags) : null,
      isPublished !== undefined ? (isPublished ? 1 : 0) : null,
      publishedAt,
      req.params.id
    );

    // Log audit event
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    logAuditEvent(req.user.id, 'portfolio_updated', 'portfolio', req.params.id, { title, slug }, ipAddress, userAgent);

    res.json({ message: 'Portfolio updated successfully', slug });
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

// Delete portfolio
router.delete('/:id', authenticateToken, idParamValidation, (req, res) => {
  try {
    const db = getDb();

    // Get portfolio
    const portfolio = db.prepare('SELECT user_id FROM portfolios WHERE id = ?').get(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Check ownership or admin access
    if (portfolio.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete portfolio (cascade will delete projects)
    db.prepare('DELETE FROM portfolios WHERE id = ?').run(req.params.id);

    // Log audit event
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    logAuditEvent(req.user.id, 'portfolio_deleted', 'portfolio', req.params.id, {}, ipAddress, userAgent);

    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ error: 'Failed to delete portfolio' });
  }
});

// Get categories
router.get('/meta/categories', (req, res) => {
  try {
    const db = getDb();
    const categories = db.prepare(`
      SELECT * FROM categories
      WHERE is_active = 1
      ORDER BY sort_order ASC, name ASC
    `).all();

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

module.exports = router;
