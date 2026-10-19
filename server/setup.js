#!/usr/bin/env node

/**
 * Portfolio Platform - Setup Script
 * 
 * This script initializes the database and seeds it with test data.
 * Run this before starting the server for the first time.
 */

const { initializeDb } = require('./db/database');
const { seedDatabase } = require('./db/seed');

async function setup() {
  console.log('\n🚀 Portfolio Platform Setup\n');
  console.log('═══════════════════════════════════════════\n');

  try {
    // Step 1: Initialize database
    console.log('📦 Step 1: Initializing database...');
    initializeDb();
    console.log('✅ Database initialized successfully\n');

    // Step 2: Seed database
    console.log('🌱 Step 2: Seeding database with test data...');
    await seedDatabase();
    console.log('✅ Database seeded successfully\n');

    console.log('═══════════════════════════════════════════');
    console.log('\n✨ Setup complete!\n');
    console.log('📝 Next steps:');
    console.log('   1. Start the backend server: npm run server');
    console.log('   2. Start the frontend: npm run dev');
    console.log('   3. Open http://localhost:3000 in your browser\n');
    console.log('🔐 Test Accounts:');
    console.log('   Admin: admin@nexusteam.com / Admin@123456');
    console.log('   Users: alex@example.com / User@123456');
    console.log('          maya@example.com / User@123456');
    console.log('          james@example.com / User@123456');
    console.log('          sofia@example.com / User@123456');
    console.log('          ryan@example.com / User@123456\n');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\nPlease check the error above and try again.\n');
    process.exit(1);
  }
}

setup();
