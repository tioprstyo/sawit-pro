import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/sawit-pro.db');

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Mock data matching test fixtures
const mockData = {
  drivers: [
    {
      id: 'driver-1',
      name: 'John Doe',
      licenseNumber: 'DL001',
      phoneNumber: '08123456789',
      status: 'available',
    },
    {
      id: 'driver-2',
      name: 'Jane Smith',
      licenseNumber: 'DL002',
      phoneNumber: '08198765432',
      status: 'available',
    },
  ],
  vehicles: [
    {
      id: 'vehicle-1',
      plateNumber: 'B-1234-ABC',
      type: 'truck',
      capacity: 12,
      driverId: 'driver-1',
      status: 'active',
    },
    {
      id: 'vehicle-2',
      plateNumber: 'B-5678-DEF',
      type: 'tanker',
      capacity: 12,
      driverId: 'driver-2',
      status: 'active',
    },
  ],
  mills: [
    {
      id: 'mill-1',
      name: 'Mill A',
      latitude: -6.1753,
      longitude: 106.8271,
      address: 'Jakarta, Indonesia',
      contactPerson: 'Budi',
      phoneNumber: '02112345678',
      avgDailyProduction: 240,
    },
    {
      id: 'mill-2',
      name: 'Mill B',
      latitude: -6.2088,
      longitude: 106.8456,
      address: 'South Jakarta, Indonesia',
      contactPerson: 'Siti',
      phoneNumber: '02187654321',
      avgDailyProduction: 240,
    },
  ],
  trips: [
    {
      id: 'trip-1',
      vehicleId: 'vehicle-1',
      driverId: 'driver-1',
      scheduledDate: '2026-07-31',
      status: 'scheduled',
      estimatedDuration: 480,
    },
    {
      id: 'trip-2',
      vehicleId: 'vehicle-2',
      driverId: 'driver-2',
      scheduledDate: '2026-07-31',
      status: 'scheduled',
      estimatedDuration: 240,
    },
  ],
  tripMills: [
    { tripId: 'trip-1', millId: 'mill-1', collectionOrder: 1 },
    { tripId: 'trip-1', millId: 'mill-2', collectionOrder: 2 },
    { tripId: 'trip-2', millId: 'mill-1', collectionOrder: 1 },
  ],
};

try {
  console.log('🌱 Seeding database with mock data...');

  const now = new Date().toISOString();

  // Clear existing data (in correct order to respect foreign keys)
  console.log('  Clearing existing data...');
  db.exec(`
    DELETE FROM collections;
    DELETE FROM trip_mills;
    DELETE FROM trips;
    DELETE FROM vehicles;
    DELETE FROM drivers;
    DELETE FROM mills;
  `);

  // Insert drivers
  console.log('  Inserting drivers...');
  const insertDriver = db.prepare(`
    INSERT INTO drivers (id, name, licenseNumber, phoneNumber, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  mockData.drivers.forEach((driver) => {
    insertDriver.run(driver.id, driver.name, driver.licenseNumber, driver.phoneNumber, driver.status, now, now);
  });
  console.log(`    ✓ Inserted ${mockData.drivers.length} drivers`);

  // Insert mills
  console.log('  Inserting mills...');
  const insertMill = db.prepare(`
    INSERT INTO mills (id, name, latitude, longitude, address, contactPerson, phoneNumber, avgDailyProduction, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  mockData.mills.forEach((mill) => {
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
      now
    );
  });
  console.log(`    ✓ Inserted ${mockData.mills.length} mills`);

  // Insert vehicles
  console.log('  Inserting vehicles...');
  const insertVehicle = db.prepare(`
    INSERT INTO vehicles (id, plateNumber, type, capacity, driverId, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  mockData.vehicles.forEach((vehicle) => {
    insertVehicle.run(
      vehicle.id,
      vehicle.plateNumber,
      vehicle.type,
      vehicle.capacity,
      vehicle.driverId,
      vehicle.status,
      now,
      now
    );
  });
  console.log(`    ✓ Inserted ${mockData.vehicles.length} vehicles`);

  // Insert trips
  console.log('  Inserting trips...');
  const insertTrip = db.prepare(`
    INSERT INTO trips (id, vehicleId, driverId, scheduledDate, status, estimatedDuration, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  mockData.trips.forEach((trip) => {
    insertTrip.run(
      trip.id,
      trip.vehicleId,
      trip.driverId,
      trip.scheduledDate,
      trip.status,
      trip.estimatedDuration,
      now,
      now
    );
  });
  console.log(`    ✓ Inserted ${mockData.trips.length} trips`);

  // Insert trip-mills relationships
  console.log('  Inserting trip-mill relationships...');
  const insertTripMill = db.prepare(`
    INSERT INTO trip_mills (tripId, millId, collectionOrder)
    VALUES (?, ?, ?)
  `);

  mockData.tripMills.forEach((tm) => {
    insertTripMill.run(tm.tripId, tm.millId, tm.collectionOrder);
  });
  console.log(`    ✓ Inserted ${mockData.tripMills.length} trip-mill relationships`);

  console.log('');
  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📊 Seeded data summary:');
  console.log(`   • Drivers: ${mockData.drivers.length}`);
  console.log(`   • Vehicles: ${mockData.vehicles.length}`);
  console.log(`   • Mills: ${mockData.mills.length}`);
  console.log(`   • Trips: ${mockData.trips.length}`);
  console.log(`   • Trip-Mill relationships: ${mockData.tripMills.length}`);
  console.log('');

  process.exit(0);
} catch (error) {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
} finally {
  db.close();
}
