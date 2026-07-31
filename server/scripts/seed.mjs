#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/sawit-pro.db');

const db = new sqlite3.Database(dbPath);

// Read mock data from TypeScript file and extract it
const mockDataPath = path.join(__dirname, '../../src/utils/mock-data.ts');
const mockDataContent = fs.readFileSync(mockDataPath, 'utf-8');

// Find the object content between the outer braces
const startIdx = mockDataContent.indexOf('export const mockData = {') + 'export const mockData = '.length;
const braceCount = (str, start) => {
  let count = 0;
  for (let i = start; i < str.length; i++) {
    if (str[i] === '{') count++;
    if (str[i] === '}') {
      count--;
      if (count === 0) return i + 1;
    }
  }
  return -1;
};

const endIdx = braceCount(mockDataContent, startIdx);
const dataStr = mockDataContent.substring(startIdx, endIdx);

// Evaluate the object (safe here since we control the source)
let mockData;
try {
  // Use new Function to evaluate - safer than eval
  mockData = new Function('return (' + dataStr + ')')();
} catch (e) {
  console.error('Failed to parse mock data:', e.message);
  console.error('Data preview:', dataStr.substring(0, 200));
  process.exit(1);
}

console.log(`📦 Loaded mock data: ${mockData.drivers.length} drivers, ${mockData.vehicles.length} vehicles`);

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
        `INSERT INTO drivers (id, name, licenseNumber, phoneNumber, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [driver.id, driver.name, driver.licenseNumber, driver.phoneNumber, driver.status, now, now]
      );
    }
    console.log(`    ✓ Inserted ${mockData.drivers.length} drivers`);

    // Insert mills (if available)
    if (mockData.mills && mockData.mills.length > 0) {
      console.log('  Inserting mills...');
      for (const mill of mockData.mills) {
        await run(
          `INSERT INTO mills (id, name, latitude, longitude, address, contactPerson, phoneNumber, avgDailyProduction, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [mill.id, mill.name, mill.latitude, mill.longitude, mill.address, mill.contactPerson, mill.phoneNumber, mill.avgDailyProduction, now, now]
        );
      }
      console.log(`    ✓ Inserted ${mockData.mills.length} mills`);
    }

    // Insert vehicles
    console.log('  Inserting vehicles...');
    for (const vehicle of mockData.vehicles) {
      await run(
        `INSERT INTO vehicles (id, plateNumber, type, capacity, driverId, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [vehicle.id, vehicle.plateNumber, vehicle.type, vehicle.capacity, vehicle.driverId, vehicle.status, now, now]
      );
    }
    console.log(`    ✓ Inserted ${mockData.vehicles.length} vehicles`);

    // Insert trips (if available)
    if (mockData.trips && mockData.trips.length > 0) {
      console.log('  Inserting trips...');
      for (const trip of mockData.trips) {
        await run(
          `INSERT INTO trips (id, vehicleId, driverId, scheduledDate, status, estimatedDuration, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [trip.id, trip.vehicleId, trip.driverId, trip.scheduledDate, trip.status, trip.estimatedDuration, now, now]
        );
      }
      console.log(`    ✓ Inserted ${mockData.trips.length} trips`);
    }

    // Insert trip-mills relationships (if available)
    if (mockData.tripMills && mockData.tripMills.length > 0) {
      console.log('  Inserting trip-mill relationships...');
      for (const tm of mockData.tripMills) {
        await run(`INSERT INTO trip_mills (tripId, millId, collectionOrder) VALUES (?, ?, ?)`, 
          [tm.tripId, tm.millId, tm.collectionOrder]);
      }
      console.log(`    ✓ Inserted ${mockData.tripMills.length} trip-mill relationships`);
    }

    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📊 Seeded data summary:');
    console.log(`   • Drivers: ${mockData.drivers.length}`);
    console.log(`   • Vehicles: ${mockData.vehicles.length}`);
    console.log(`   • Mills: ${mockData.mills ? mockData.mills.length : 0}`);
    console.log(`   • Trips: ${mockData.trips ? mockData.trips.length : 0}`);
    console.log(`   • Trip-Mill relationships: ${mockData.tripMills ? mockData.tripMills.length : 0}`);
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
