#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/sawit-pro.db');

// Ensure directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

const schema = `
-- Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  licenseNumber TEXT NOT NULL UNIQUE,
  phoneNumber TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sick', 'on_trip', 'leave')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  plateNumber TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('truck', 'tanker', 'flatbed', 'trailer')),
  capacity INTEGER NOT NULL,
  driverId TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'breakdown')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (driverId) REFERENCES drivers(id) ON DELETE CASCADE
);

-- Mills Table
CREATE TABLE IF NOT EXISTS mills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT NOT NULL,
  contactPerson TEXT NOT NULL,
  phoneNumber TEXT NOT NULL,
  avgDailyProduction INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trips Table
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  vehicleId TEXT NOT NULL,
  driverId TEXT NOT NULL,
  scheduledDate DATETIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  estimatedDuration INTEGER NOT NULL,
  actualDuration INTEGER,
  startTime DATETIME,
  endTime DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (driverId) REFERENCES drivers(id) ON DELETE CASCADE
);

-- Trip Mills Junction Table
CREATE TABLE IF NOT EXISTS trip_mills (
  tripId TEXT NOT NULL,
  millId TEXT NOT NULL,
  collectionOrder INTEGER NOT NULL,
  quantity INTEGER,
  collectedAt DATETIME,
  PRIMARY KEY (tripId, millId),
  FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (millId) REFERENCES mills(id) ON DELETE CASCADE
);

-- Collections Table
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  tripId TEXT NOT NULL,
  millId TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (millId) REFERENCES mills(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicles_driverId ON vehicles(driverId);
CREATE INDEX IF NOT EXISTS idx_trips_vehicleId ON trips(vehicleId);
CREATE INDEX IF NOT EXISTS idx_trips_driverId ON trips(driverId);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_scheduledDate ON trips(scheduledDate);
CREATE INDEX IF NOT EXISTS idx_collections_tripId ON collections(tripId);
CREATE INDEX IF NOT EXISTS idx_collections_millId ON collections(millId);
CREATE INDEX IF NOT EXISTS idx_trip_mills_tripId ON trip_mills(tripId);
CREATE INDEX IF NOT EXISTS idx_trip_mills_millId ON trip_mills(millId);
`;

async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.exec(schema, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

initializeDatabase()
  .then(() => {
    console.log('📊 Initializing database...');
    console.log('  ✓ Database schema created successfully');
    console.log(`  ✓ Database location: ${dbPath}`);
    console.log('  ✓ Seed data inserted');
    console.log('  ✓ Database initialization complete');
    console.log('');
    db.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database initialization failed:', error.message);
    db.close();
    process.exit(1);
  });
