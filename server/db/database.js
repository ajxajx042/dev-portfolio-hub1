const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'portfolio.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    
    // Enable WAL mode for better concurrent access
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    
    // Initialize database if needed
    initializeDb();
  }
  return db;
}

function initializeDb() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  // Execute schema (CREATE TABLE IF NOT EXISTS is safe to run multiple times)
  db.exec(schema);
  
  console.log('✓ Database initialized');
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
    console.log('✓ Database connection closed');
  }
}

module.exports = {
  getDb,
  closeDb,
  initializeDb
};
