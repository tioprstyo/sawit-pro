import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/sawit-pro.db');

try {
  console.log('Resetting database...');

  // Delete the database file
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✓ Database file deleted');
  }

  // Delete WAL files if they exist
  if (fs.existsSync(`${dbPath}-wal`)) {
    fs.unlinkSync(`${dbPath}-wal`);
  }
  if (fs.existsSync(`${dbPath}-shm`)) {
    fs.unlinkSync(`${dbPath}-shm`);
  }

  console.log('✓ Database reset complete');
  console.log('Run "npm run db:init" to reinitialize the database');
  process.exit(0);
} catch (error: any) {
  console.error('✗ Database reset failed:', error.message);
  process.exit(1);
}
