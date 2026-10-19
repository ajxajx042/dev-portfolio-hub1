const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db/database');
const { authenticateToken, logAuditEvent } = require('../middleware/auth');
const { updateUserValidation, idParamValidation } = require('../middleware/validation');

// Get user profile by ID (public)
router.get('/:id', idParamValidation, (req, res) => {
  try {
    const db = getDb();
    const user = db.prepare(`
      SELECT id, name, avatar_url, bio, headline, location, 
             website, linkedin_url, github_url, twitter_url, created_at
      FROM users 
      WHERE id = ? AND is_active = 1
    `).get(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user skills
    const skills = db.prepare(`
      SELECT id, name, category, proficiency_level
      FROM skills
      WHERE user_id = ?
      ORDER BY proficiency_level DESC, name ASC
    `).all(req.params.id);

    // Get user experience
    const experience = db.prepare(`
      SELECT id, company, position, description, start_date, end_date, is_current
      FROM experience
      WHERE user_id = ?
      ORDER BY 
        CASE WHEN is_current = 1 THEN 0 ELSE 1 END,
        start_date DESC
    `).all(req.params.id);

    // Get user education
    const education = db.prepare(`
      SELECT id, institution, degree, field_of_study, start_date, end_date, description
      FROM education
      WHERE user_id = ?
      ORDER BY start_date DESC
    `).all(req.params.id);

    // Get user portfolios (only published ones for public view)
    const portfolios = db.prepare(`
      SELECT id, title, slug, description, cover_image_url, category, tags, 
             view_count, created_at, published_at
      FROM portfolios
      WHERE user_id = ? AND is_published = 1
      ORDER BY published_at DESC
    `).all(req.params.id);

    res.json({
      user: {
        ...user,
        skills,
        experience,
        education,
        portfolios
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Get current user's full profile (private)
router.get('/me/profile', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    const user = db.prepare(`
      SELECT id, email, name, role, avatar_url, bio, headline, location, 
             website, linkedin_url, github_url, twitter_url, 
             is_active, email_verified, created_at, last_login_at
      FROM users 
      WHERE id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all user data
    const skills = db.prepare('SELECT * FROM skills WHERE user_id = ? ORDER BY proficiency_level DESC').all(req.user.id);
    const experience = db.prepare('SELECT * FROM experience WHERE user_id = ? ORDER BY start_date DESC').all(req.user.id);
    const education = db.prepare('SELECT * FROM education WHERE user_id = ? ORDER BY start_date DESC').all(req.user.id);
    const portfolios = db.prepare('SELECT * FROM portfolios WHERE user_id = ? ORDER BY updated_at DESC').all(req.user.id);

    res.json({
      user: {
        ...user,
        skills,
        experience,
        education,
        portfolios
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/me/profile', authenticateToken, updateUserValidation, (req, res) => {
  try {
    const db = getDb();
    const { 
      name, bio, headline, location, 
      website, linkedinUrl, githubUrl, twitterUrl 
    } = req.body;

    // Update user
    db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name),
          bio = COALESCE(?, bio),
          headline = COALESCE(?, headline),
          location = COALESCE(?, location),
          website = COALESCE(?, website),
          linkedin_url = COALESCE(?, linkedin_url),
          github_url = COALESCE(?, github_url),
          twitter_url = COALESCE(?, twitter_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name, bio, headline, location,
      website, linkedinUrl, githubUrl, twitterUrl,
      req.user.id
    );

    // Log audit event
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    logAuditEvent(req.user.id, 'profile_updated', 'user', req.user.id, req.body, ipAddress, userAgent);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Add skill
router.post('/me/skills', authenticateToken, (req, res) => {
  try {
    const { name, category, proficiencyLevel } = req.body;
    const db = getDb();

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    const skillId = uuidv4();
    db.prepare(`
      INSERT INTO skills (id, user_id, name, category, proficiency_level)
      VALUES (?, ?, ?, ?, ?)
    `).run(skillId, req.user.id, name.trim(), category, proficiencyLevel || 3);

    res.status(201).json({ 
      message: 'Skill added successfully',
      skillId 
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

// Update skill
router.put('/me/skills/:skillId', authenticateToken, (req, res) => {
  try {
    const { name, category, proficiencyLevel } = req.body;
    const db = getDb();

    // Verify ownership
    const skill = db.prepare('SELECT user_id FROM skills WHERE id = ?').get(req.params.skillId);
    if (!skill || skill.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.prepare(`
      UPDATE skills 
      SET name = COALESCE(?, name),
          category = COALESCE(?, category),
          proficiency_level = COALESCE(?, proficiency_level)
      WHERE id = ?
    `).run(name, category, proficiencyLevel, req.params.skillId);

    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// Delete skill
router.delete('/me/skills/:skillId', authenticateToken, (req, res) => {
  try {
    const db = getDb();

    // Verify ownership
    const skill = db.prepare('SELECT user_id FROM skills WHERE id = ?').get(req.params.skillId);
    if (!skill || skill.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.prepare('DELETE FROM skills WHERE id = ?').run(req.params.skillId);

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// Add experience
router.post('/me/experience', authenticateToken, (req, res) => {
  try {
    const { company, position, description, startDate, endDate, isCurrent } = req.body;
    const db = getDb();

    if (!company || !position || !startDate) {
      return res.status(400).json({ error: 'Company, position, and start date are required' });
    }

    const experienceId = uuidv4();
    db.prepare(`
      INSERT INTO experience (id, user_id, company, position, description, start_date, end_date, is_current)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(experienceId, req.user.id, company, position, description, startDate, endDate, isCurrent ? 1 : 0);

    res.status(201).json({ 
      message: 'Experience added successfully',
      experienceId 
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({ error: 'Failed to add experience' });
  }
});

// Update experience
router.put('/me/experience/:experienceId', authenticateToken, (req, res) => {
  try {
    const { company, position, description, startDate, endDate, isCurrent } = req.body;
    const db = getDb();

    // Verify ownership
    const exp = db.prepare('SELECT user_id FROM experience WHERE id = ?').get(req.params.experienceId);
    if (!exp || exp.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.prepare(`
      UPDATE experience 
      SET company = COALESCE(?, company),
          position = COALESCE(?, position),
          description = COALESCE(?, description),
          start_date = COALESCE(?, start_date),
          end_date = ?,
          is_current = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(company, position, description, startDate, endDate, isCurrent ? 1 : 0, req.params.experienceId);

    res.json({ message: 'Experience updated successfully' });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

// Delete experience
router.delete('/me/experience/:experienceId', authenticateToken, (req, res) => {
  try {
    const db = getDb();

    // Verify ownership
    const exp = db.prepare('SELECT user_id FROM experience WHERE id = ?').get(req.params.experienceId);
    if (!exp || exp.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.prepare('DELETE FROM experience WHERE id = ?').run(req.params.experienceId);

    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// Deactivate account
router.post('/me/deactivate', authenticateToken, (req, res) => {
  try {
    const db = getDb();

    // Deactivate user
    db.prepare('UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(req.user.id);

    // Invalidate all sessions
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(req.user.id);

    // Log audit event
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    logAuditEvent(req.user.id, 'account_deactivated', 'user', req.user.id, {}, ipAddress, userAgent);

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({ error: 'Failed to deactivate account' });
  }
});

module.exports = router;
