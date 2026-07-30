import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

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
  console.log('📊 Initializing database...');

  db.exec(schema);

  console.log('  ✓ Database schema created successfully');
  console.log(`  ✓ Database location: ${dbPath}`);

  // Seed initial data
  seedData();

  console.log('  ✓ Database initialization complete');
  process.exit(0);
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
} finally {
  db.close();
}

function seedData() {
  const db = new Database(dbPath);

  try {
    // Insert sample drivers
    const insertDriver = db.prepare(`
      INSERT INTO drivers (id, name, licenseNumber, phoneNumber, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertDriver.run('driver-1', 'John Doe', 'DL001', '08123456789', 'available');
    insertDriver.run('driver-2', 'Jane Smith', 'DL002', '08198765432', 'available');

    // Insert sample vehicles
    const insertVehicle = db.prepare(`
      INSERT INTO vehicles (id, plateNumber, type, capacity, driverId, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertVehicle.run('vehicle-1', 'B-1234-ABC', 'truck', 12, 'driver-1', 'active');
    insertVehicle.run('vehicle-2', 'B-5678-DEF', 'tanker', 12, 'driver-2', 'active');

    // Insert sample mills
    const insertMill = db.prepare(`
      INSERT INTO mills (id, name, latitude, longitude, address, contactPerson, phoneNumber, avgDailyProduction)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMill.run('mill-1', 'Mill A', -6.1753, 106.8271, 'Jakarta, Indonesia', 'Budi', '02112345678', 240);
    insertMill.run('mill-2', 'Mill B', -6.2088, 106.8456, 'South Jakarta, Indonesia', 'Siti', '02187654321', 240);

    // Insert sample trip
    const now = new Date();
    const insertTrip = db.prepare(`
      INSERT INTO trips (id, vehicleId, driverId, scheduledDate, status, estimatedDuration)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const tripId = 'trip-1';
    insertTrip.run(tripId, 'vehicle-1', 'driver-1', now.toISOString(), 'scheduled', 480);

    // Link mills to trip
    const insertTripMill = db.prepare(`
      INSERT INTO trip_mills (tripId, millId, collectionOrder)
      VALUES (?, ?, ?)
    `);

    insertTripMill.run(tripId, 'mill-1', 1);
    insertTripMill.run(tripId, 'mill-2', 2);

    console.log('  ✓ Seed data inserted');
  } catch (error) {
    console.log('  ℹ Seed data may already exist');
  } finally {
    db.close();
  }
}
