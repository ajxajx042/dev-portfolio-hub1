const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  
  // Check extension
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // Check mimetype
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Upload profile picture
router.post('/profile-picture', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Update user's avatar URL in database
    const { getDb } = require('../db/database');
    const db = getDb();
    
    // Get old avatar to delete file
    const user = db.prepare('SELECT avatar_url FROM users WHERE id = ?').get(req.user.id);
    
    db.prepare('UPDATE users SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(fileUrl, req.user.id);
    
    // Delete old file if exists
    if (user.avatar_url) {
      const oldFilePath = path.join(__dirname, '../../', user.avatar_url);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    res.json({
      message: 'Profile picture uploaded successfully',
      url: fileUrl
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

// Upload portfolio cover image
router.post('/portfolio-cover/:portfolioId', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { getDb } = require('../db/database');
    const db = getDb();

    // Verify portfolio ownership
    const portfolio = db.prepare('SELECT user_id, cover_image_url FROM portfolios WHERE id = ?')
      .get(req.params.portfolioId);

    if (!portfolio) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    if (portfolio.user_id !== req.user.id && req.user.role !== 'admin') {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: 'Access denied' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Update portfolio cover image
    db.prepare('UPDATE portfolios SET cover_image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(fileUrl, req.params.portfolioId);
    
    // Delete old file if exists
    if (portfolio.cover_image_url) {
      const oldFilePath = path.join(__dirname, '../../', portfolio.cover_image_url);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    res.json({
      message: 'Cover image uploaded successfully',
      url: fileUrl
    });
  } catch (error) {
    console.error('Upload cover image error:', error);
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload cover image' });
  }
});

// Upload project image
router.post('/project-image/:projectId', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { getDb } = require('../db/database');
    const db = getDb();

    // Verify project ownership
    const project = db.prepare(`
      SELECT p.*, por.user_id 
      FROM projects p
      JOIN portfolios por ON p.portfolio_id = por.id
      WHERE p.id = ?
    `).get(req.params.projectId);

    if (!project) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.user_id !== req.user.id && req.user.role !== 'admin') {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: 'Access denied' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Update project image
    db.prepare('UPDATE projects SET image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(fileUrl, req.params.projectId);
    
    // Delete old file if exists
    if (project.image_url) {
      const oldFilePath = path.join(__dirname, '../../', project.image_url);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    res.json({
      message: 'Project image uploaded successfully',
      url: fileUrl
    });
  } catch (error) {
    console.error('Upload project image error:', error);
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload project image' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: error.message });
  } else if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
});

module.exports = router;
