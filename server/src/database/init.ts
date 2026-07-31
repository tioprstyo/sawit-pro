import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockData } from '../../../src/utils/mock-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/sawit-pro.db');

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

const schema = `
-- Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  licenseNumber TEXT NOT NULL UNIQUE,
  phoneNumber TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'on_duty', 'off_duty', 'on_leave')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  plateNumber TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('truck', 'tanker', 'flatbed')),
  capacity INTEGER NOT NULL,
  driverId TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'in_use')),
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

try {
  console.log('Initializing database...');

  db.exec(schema);

  console.log('✓ Database schema created successfully');
  console.log(`✓ Database location: ${dbPath}`);

  // Seed initial data
  seedData();

  console.log('✓ Database initialization complete');
  process.exit(0);
} catch (error) {
  console.error('✗ Database initialization failed:', error);
  process.exit(1);
} finally {
  db.close();
}

function seedData() {
  const db = new Database(dbPath);

  try {
    // Insert drivers from mockData
    const insertDriver = db.prepare(`
      INSERT INTO drivers (id, name, licenseNumber, phoneNumber, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const driver of mockData.drivers) {
      insertDriver.run(driver.id, driver.name, driver.licenseNumber, driver.phoneNumber, driver.status);
    }

    // Insert vehicles from mockData
    const insertVehicle = db.prepare(`
      INSERT INTO vehicles (id, plateNumber, type, capacity, driverId, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const vehicle of mockData.vehicles) {
      insertVehicle.run(vehicle.id, vehicle.plateNumber, vehicle.type, vehicle.capacity, vehicle.driverId, vehicle.status);
    }

    console.log(`✓ Seed data inserted (${mockData.drivers.length} drivers, ${mockData.vehicles.length} vehicles)`);
  } catch (error) {
    console.error('Note: Seed data may already exist:', error);
  } finally {
    db.close();
  }
}
