import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { mockData } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/sawit-pro.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
    db.pragma('journal_mode = WAL');
  }
  return db;
}

function initializeSchema() {
  const database = getDb();

  const schema = `
-- Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  licenseNumber TEXT NOT NULL UNIQUE,
  phoneNumber TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'on_duty', 'off_duty', 'on_leave', 'on_trip', 'sick', 'leave')),
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
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'in_use', 'breakdown')),
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
  date DATETIME NOT NULL,
  scheduledDate DATETIME,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  estimatedDuration INTEGER,
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
CREATE INDEX IF NOT EXISTS idx_trips_date ON trips(date);
CREATE INDEX IF NOT EXISTS idx_collections_tripId ON collections(tripId);
CREATE INDEX IF NOT EXISTS idx_collections_millId ON collections(millId);
CREATE INDEX IF NOT EXISTS idx_trip_mills_tripId ON trip_mills(tripId);
CREATE INDEX IF NOT EXISTS idx_trip_mills_millId ON trip_mills(millId);
  `;

  database.exec(schema);
}

export function initializeDatabase() {
  const database = getDb();

  try {
    console.log('🗄️  Initializing SQLite database...');
    initializeSchema();

    // Check if data exists
    const driverCount = database
      .prepare('SELECT COUNT(*) as count FROM drivers')
      .get() as { count: number };

    if (driverCount.count === 0) {
      console.log('📥 Seeding database with mock data...');
      seedDatabase();
      console.log(
        `✓ Database seeded with ${mockData.drivers.length} drivers, ${mockData.vehicles.length} vehicles, ${mockData.mills.length} mills, ${mockData.trips.length} trips`,
      );
    } else {
      console.log(`✓ Database already seeded (${driverCount.count} drivers found)`);
    }

    console.log(`✓ Database location: ${dbPath}`);
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    throw error;
  }
}

function seedDatabase() {
  const database = getDb();
  const now = new Date().toISOString();

  try {
    // Insert drivers
    const insertDriver = database.prepare(`
      INSERT OR IGNORE INTO drivers (id, name, licenseNumber, phoneNumber, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const driver of mockData.drivers) {
      insertDriver.run(driver.id, driver.name, driver.licenseNumber, driver.phoneNumber, driver.status, now, now);
    }

    // Insert mills
    const insertMill = database.prepare(`
      INSERT OR IGNORE INTO mills (id, name, latitude, longitude, address, contactPerson, phoneNumber, avgDailyProduction, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const mill of mockData.mills || []) {
      insertMill.run(
        mill.id,
        mill.name,
        mill.latitude,
        mill.longitude,
        mill.address,
        mill.contactPerson,
        mill.phoneNumber,
        mill.avgDailyProduction,
        now,
        now,
      );
    }

    // Insert vehicles
    const insertVehicle = database.prepare(`
      INSERT OR IGNORE INTO vehicles (id, plateNumber, type, capacity, driverId, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const vehicle of mockData.vehicles) {
      insertVehicle.run(
        vehicle.id,
        vehicle.plateNumber,
        vehicle.type,
        vehicle.capacity,
        vehicle.driverId,
        vehicle.status,
        now,
        now,
      );
    }

    // Insert trips
    const insertTrip = database.prepare(`
      INSERT OR IGNORE INTO trips (id, vehicleId, driverId, date, status, estimatedDuration, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const trip of mockData.trips || []) {
      insertTrip.run(trip.id, trip.vehicleId, trip.driverId, trip.date || trip.scheduledDate, trip.status, trip.estimatedDuration || 0, now, now);
    }

    // Insert trip-mills relationships
    const insertTripMill = database.prepare(`
      INSERT OR IGNORE INTO trip_mills (tripId, millId, collectionOrder)
      VALUES (?, ?, ?)
    `);

    for (const tm of mockData.tripMills || []) {
      insertTripMill.run(tm.tripId, tm.millId, tm.collectionOrder);
    }
  } catch (error) {
    console.error('Seed error (may be duplicate data):', error);
  }
}

export const sqliteDb = {
  getDb,

  // Drivers
  getDrivers: () => {
    const database = getDb();
    return database.prepare('SELECT * FROM drivers').all();
  },
  getDriverById: (id: string) => {
    const database = getDb();
    return database.prepare('SELECT * FROM drivers WHERE id = ?').get(id);
  },
  addDriver: (data: any) => {
    const database = getDb();
    const now = new Date().toISOString();
    const id = data.id || uuidv4();
    database
      .prepare(
        'INSERT INTO drivers (id, name, licenseNumber, phoneNumber, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      )
      .run(id, data.name, data.licenseNumber, data.phoneNumber, data.status || 'available', now, now);
    return database.prepare('SELECT * FROM drivers WHERE id = ?').get(id);
  },
  updateDriver: (id: string, updates: any) => {
    const database = getDb();
    const now = new Date().toISOString();
    const driver = database.prepare('SELECT * FROM drivers WHERE id = ?').get(id);
    if (!driver) return null;

    const updated = { ...driver, ...updates, updatedAt: now };
    database
      .prepare(
        'UPDATE drivers SET name = ?, licenseNumber = ?, phoneNumber = ?, status = ?, updatedAt = ? WHERE id = ?',
      )
      .run(updated.name, updated.licenseNumber, updated.phoneNumber, updated.status, updated.updatedAt, id);

    return database.prepare('SELECT * FROM drivers WHERE id = ?').get(id);
  },
  deleteDriver: (id: string) => {
    const database = getDb();
    const result = database.prepare('DELETE FROM drivers WHERE id = ?').run(id);
    return result.changes > 0;
  },

  // Vehicles
  getVehicles: () => {
    const database = getDb();
    return database.prepare('SELECT * FROM vehicles').all();
  },
  getVehicleById: (id: string) => {
    const database = getDb();
    return database.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
  },
  addVehicle: (data: any) => {
    const database = getDb();
    const now = new Date().toISOString();
    const id = data.id || uuidv4();
    database
      .prepare(
        'INSERT INTO vehicles (id, plateNumber, type, capacity, driverId, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .run(id, data.plateNumber, data.type, data.capacity, data.driverId, data.status || 'active', now, now);
    return database.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
  },
  updateVehicle: (id: string, updates: any) => {
    const database = getDb();
    const now = new Date().toISOString();
    const vehicle = database.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
    if (!vehicle) return null;

    const updated = { ...vehicle, ...updates, updatedAt: now };
    database
      .prepare('UPDATE vehicles SET plateNumber = ?, type = ?, capacity = ?, driverId = ?, status = ?, updatedAt = ? WHERE id = ?')
      .run(updated.plateNumber, updated.type, updated.capacity, updated.driverId, updated.status, updated.updatedAt, id);

    return database.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
  },
  deleteVehicle: (id: string) => {
    const database = getDb();
    const result = database.prepare('DELETE FROM vehicles WHERE id = ?').run(id);
    return result.changes > 0;
  },

  // Mills
  getMills: () => {
    const database = getDb();
    return database.prepare('SELECT * FROM mills').all();
  },
  getMillById: (id: string) => {
    const database = getDb();
    return database.prepare('SELECT * FROM mills WHERE id = ?').get(id);
  },
  addMill: (data: any) => {
    const database = getDb();
    const now = new Date().toISOString();
    const id = data.id || uuidv4();
    database
      .prepare(
        'INSERT INTO mills (id, name, latitude, longitude, address, contactPerson, phoneNumber, avgDailyProduction, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .run(
        id,
        data.name,
        data.latitude,
        data.longitude,
        data.address,
        data.contactPerson,
        data.phoneNumber,
        data.avgDailyProduction,
        now,
        now,
      );
    return database.prepare('SELECT * FROM mills WHERE id = ?').get(id);
  },
  updateMill: (id: string, updates: any) => {
    const database = getDb();
    const now = new Date().toISOString();
    const mill = database.prepare('SELECT * FROM mills WHERE id = ?').get(id);
    if (!mill) return null;

    const updated = { ...mill, ...updates, updatedAt: now };
    database
      .prepare(
        'UPDATE mills SET name = ?, latitude = ?, longitude = ?, address = ?, contactPerson = ?, phoneNumber = ?, avgDailyProduction = ?, updatedAt = ? WHERE id = ?',
      )
      .run(
        updated.name,
        updated.latitude,
        updated.longitude,
        updated.address,
        updated.contactPerson,
        updated.phoneNumber,
        updated.avgDailyProduction,
        updated.updatedAt,
        id,
      );

    return database.prepare('SELECT * FROM mills WHERE id = ?').get(id);
  },
  deleteMill: (id: string) => {
    const database = getDb();
    const result = database.prepare('DELETE FROM mills WHERE id = ?').run(id);
    return result.changes > 0;
  },

  // Trips
  getTrips: () => {
    const database = getDb();
    return database.prepare('SELECT * FROM trips').all();
  },
  getTripById: (id: string) => {
    const database = getDb();
    return database.prepare('SELECT * FROM trips WHERE id = ?').get(id);
  },
  addTrip: (data: any) => {
    const database = getDb();
    const now = new Date().toISOString();
    const id = data.id || uuidv4();
    database
      .prepare(
        'INSERT INTO trips (id, vehicleId, driverId, date, status, estimatedDuration, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .run(id, data.vehicleId, data.driverId, data.date || data.scheduledDate, data.status || 'scheduled', data.estimatedDuration || 0, now, now);
    return database.prepare('SELECT * FROM trips WHERE id = ?').get(id);
  },
  updateTrip: (id: string, updates: any) => {
    const database = getDb();
    const now = new Date().toISOString();
    const trip = database.prepare('SELECT * FROM trips WHERE id = ?').get(id);
    if (!trip) return null;

    const updated = { ...trip, ...updates, updatedAt: now };
    database
      .prepare(
        'UPDATE trips SET vehicleId = ?, driverId = ?, date = ?, status = ?, estimatedDuration = ?, actualDuration = ?, startTime = ?, endTime = ?, updatedAt = ? WHERE id = ?',
      )
      .run(
        updated.vehicleId,
        updated.driverId,
        updated.date,
        updated.status,
        updated.estimatedDuration,
        updated.actualDuration,
        updated.startTime,
        updated.endTime,
        updated.updatedAt,
        id,
      );

    return database.prepare('SELECT * FROM trips WHERE id = ?').get(id);
  },
  deleteTrip: (id: string) => {
    const database = getDb();
    const result = database.prepare('DELETE FROM trips WHERE id = ?').run(id);
    return result.changes > 0;
  },
};
