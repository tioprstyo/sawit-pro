// This script generates seed.mjs from the shared mock-data.ts
// It extracts the drivers and vehicles and creates a new seed script

const fs = require('fs');
const path = require('path');

// Read the mock-data.ts file
const mockDataPath = path.join(__dirname, '../../src/utils/mock-data.ts');
const mockDataContent = fs.readFileSync(mockDataPath, 'utf-8');

// Extract the mockData object
const startIdx = mockDataContent.indexOf('export const mockData = {');
const endIdx = mockDataContent.indexOf('};', startIdx) + 2;
const mockDataStr = mockDataContent.substring(startIdx, endIdx);

// Create the new seed script that uses this data
const seedScript = `#!/usr/bin/env node

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

// Import mock data from shared file
${mockDataStr.replace('export const mockData = ', 'const mockData = ')};

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with mock data...');
    console.log('');

    const now = new Date().toISOString();

    // Enable foreign keys
    await run('PRAGMA foreign_keys = ON');

    // Clear existing data
    console.log('  Clearing existing data...');
    await run('DELETE FROM collections');
    await run('DELETE FROM trip_mills');
    await run('DELETE FROM trips');
    await run('DELETE FROM vehicles');
    await run('DELETE FROM drivers');
    await run('DELETE FROM mills');

    // Insert drivers
    console.log('  Inserting drivers...');
    for (const driver of mockData.drivers) {
      await run(
        \`INSERT INTO drivers (id, name, licenseNumber, phoneNumber, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)\`,
        [
          driver.id,
          driver.name,
          driver.licenseNumber,
          driver.phoneNumber,
          driver.status,
          now,
          now,
        ]
      );
    }
    console.log(\`    ✓ Inserted \${mockData.drivers.length} drivers\`);

    // Insert mills
    console.log('  Inserting mills...');
    for (const mill of mockData.mills) {
      await run(
        \`INSERT INTO mills (id, name, latitude, longitude, address, contactPerson, phoneNumber, avgDailyProduction, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`,
        [
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
        ]
      );
    }
    console.log(\`    ✓ Inserted \${mockData.mills.length} mills\`);

    // Insert vehicles
    console.log('  Inserting vehicles...');
    for (const vehicle of mockData.vehicles) {
      await run(
        \`INSERT INTO vehicles (id, plateNumber, type, capacity, driverId, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)\`,
        [
          vehicle.id,
          vehicle.plateNumber,
          vehicle.type,
          vehicle.capacity,
          vehicle.driverId,
          vehicle.status,
          now,
          now,
        ]
      );
    }
    console.log(\`    ✓ Inserted \${mockData.vehicles.length} vehicles\`);

    // Insert trips
    console.log('  Inserting trips...');
    for (const trip of mockData.trips) {
      await run(
        \`INSERT INTO trips (id, vehicleId, driverId, scheduledDate, status, estimatedDuration, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)\`,
        [
          trip.id,
          trip.vehicleId,
          trip.driverId,
          trip.scheduledDate,
          trip.status,
          trip.estimatedDuration,
          now,
          now,
        ]
      );
    }
    console.log(\`    ✓ Inserted \${mockData.trips.length} trips\`);

    // Insert trip-mills relationships
    console.log('  Inserting trip-mill relationships...');
    for (const tm of mockData.tripMills) {
      await run(\`INSERT INTO trip_mills (tripId, millId, collectionOrder) VALUES (?, ?, ?)\`, [
        tm.tripId,
        tm.millId,
        tm.collectionOrder,
      ]);
    }
    console.log(\`    ✓ Inserted \${mockData.tripMills.length} trip-mill relationships\`);

    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📊 Seeded data summary:');
    console.log(\`   • Drivers: \${mockData.drivers.length}\`);
    console.log(\`   • Vehicles: \${mockData.vehicles.length}\`);
    console.log(\`   • Mills: \${mockData.mills.length}\`);
    console.log(\`   • Trips: \${mockData.trips.length}\`);
    console.log(\`   • Trip-Mill relationships: \${mockData.tripMills.length}\`);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

seedDatabase();
`;

fs.writeFileSync(path.join(__dirname, 'seed.mjs'), seedScript);
console.log('✓ Generated seed.mjs with full mock data (200 drivers + 100+ vehicles)');
