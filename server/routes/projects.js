const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db/database');
const { authenticateToken, logAuditEvent } = require('../middleware/auth');
const { 
  createProjectValidation, 
  updateProjectValidation,
  idParamValidation
} = require('../middleware/validation');

// Get all projects for a portfolio
router.get('/portfolio/:portfolioId', (req, res) => {
  try {
    const db = getDb();
    
    // Verify portfolio exists and is accessible
    const portfolio = db.prepare(`
      SELECT p.*, u.is_active 
      FROM portfolios p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `).get(req.params.portfolioId);

    if (!portfolio || !portfolio.is_active) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Check if portfolio is published or user has access
    if (!portfolio.is_published) {
      // For now, allow access to unpublished portfolio projects
      // In production, you'd check authentication here
    }

    const projects = db.prepare(`
      SELECT * FROM projects
      WHERE portfolio_id = ?
      ORDER BY sort_order ASC, created_at DESC
    `).all(req.params.portfolioId);

    const parsedProjects = projects.map(p => ({
      ...p,
      technologies: p.technologies ? JSON.parse(p.technologies) : []
    }));

    res.json({ projects: parsedProjects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
});

// Get single project
router.get('/:id', idParamValidation, (req, res) => {
  try {
    const db = getDb();
    
    const project = db.prepare(`
      SELECT p.*, por.title as portfolio_title, por.user_id
      FROM projects p
      JOIN portfolios por ON p.portfolio_id = por.id
      WHERE p.id = ?
    `).get(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if portfolio is published
    const portfolio = db.prepare('SELECT is_published FROM portfolios WHERE id = ?').get(project.portfolio_id);
    
    if (!portfolio.is_published) {
      // For unpublished portfolios, only allow owner or admin to view
      // In production, check authentication here
    }

    const parsedProject = {
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : []
    };

    res.json({ project: parsedProject });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

// Create project
router.post('/portfolio/:portfolioId', authenticateToken, createProjectValidation, (req, res) => {
  try {
    const db = getDb();
    const { portfolioId } = req.params;
    const { 
      title, description, shortDescription, 
      technologies, category, projectUrl, githubUrl 
    } = req.body;

    // Verify portfolio exists and user owns it
    const portfolio = db.prepare('SELECT user_id FROM portfolios WHERE id = ?').get(portfolioId);

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    if (portfolio.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get max sort order
    const maxOrder = db.prepare(`
      SELECT MAX(sort_order) as max_order 
      FROM projects 
      WHERE portfolio_id = ?
    `).get(portfolioId);

    const sortOrder = (maxOrder.max_order || 0) + 1;

    const projectId = uuidv4();
    db.prepare(`
      INSERT INTO projects (id, portfolio_id, title, description, short_description, technologies, category, project_url, github_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      projectId,
      portfolioId,
      title,
      description,
      shortDescription,
      JSON.stringify(technologies || []),
      category,
      projectUrl,
      githubUrl,
      sortOrder
    );

    // Log audit event
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    logAuditEvent(req.user.id, 'project_created', 'project', projectId, { title, portfolioId }, ipAddress, userAgent);

    res.status(201).json({
      message: 'Project created successfully',
      projectId
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', authenticateToken, updateProjectValidation, (req, res) => {
  try {
    const db = getDb();
    const { 
      title, description, shortDescription, 
      technologies, category, projectUrl, githubUrl 
    } = req.body;

    // Get project with portfolio info
    const project = db.prepare(`
      SELECT p.*, por.user_id
      FROM projects p
      JOIN portfolios por ON p.portfolio_id = por.id
      WHERE p.id = ?
    `).get(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check ownership or admin access
    if (project.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.prepare(`
      UPDATE projects
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          short_description = COALESCE(?, short_description),
          technologies = COALESCE(?, technologies),
          category = COALESCE(?, category),
          project_url = COALESCE(?, project_url),
          github_url = COALESCE(?, github_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title,
      description,
      shortDescription,
      technologies ? JSON.stringify(technologies) : null,
      category,
      projectUrl,
      githubUrl,
      req.params.id
    );

    // Log audit event
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    logAuditEvent(req.user.id, 'project_updated', 'project', req.params.id, { title }, ipAddress, userAgent);

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Reorder projects
router.put('/portfolio/:portfolioId/reorder', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const { portfolioId } = req.params;
    const { projectIds } = req.body; // Array of project IDs in desired order

    if (!Array.isArray(projectIds)) {
      return res.status(400).json({ error: 'projectIds must be an array' });
    }

    // Verify portfolio ownership
    const portfolio = db.prepare('SELECT user_id FROM portfolios WHERE id = ?').get(portfolioId);

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    if (portfolio.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update sort order for each project
    const updateStmt = db.prepare('UPDATE projects SET sort_order = ? WHERE id = ? AND portfolio_id = ?');
    
    const transaction = db.transaction((ids) => {
      ids.forEach((id, index) => {
        updateStmt.run(index + 1, id, portfolioId);
      });
    });

    transaction(projectIds);

    res.json({ message: 'Projects reordered successfully' });
  } catch (error) {
    console.error('Reorder projects error:', error);
    res.status(500).json({ error: 'Failed to reorder projects' });
  }
});

// Delete project
router.delete('/:id', authenticateToken, idParamValidation, (req, res) => {
  try {
    const db = getDb();

    // Get project with portfolio info
    const project = db.prepare(`
      SELECT p.*, por.user_id
      FROM projects p
      JOIN portfolios por ON p.portfolio_id = por.id
      WHERE p.id = ?
    `).get(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check ownership or admin access
    if (project.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);

    // Log audit event
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    logAuditEvent(req.user.id, 'project_deleted', 'project', req.params.id, {}, ipAddress, userAgent);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
