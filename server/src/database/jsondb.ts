import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockData } from '../utils/mock-data.js';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../../data');
const dbPath = path.join(dataDir, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

interface Database {
  drivers: any[];
  vehicles: any[];
  mills: any[];
  trips: any[];
}

let db: Database = {
  drivers: [],
  vehicles: [],
  mills: [],
  trips: [],
};

// Load or initialize database
function loadDatabase() {
  if (fs.existsSync(dbPath)) {
    try {
      const data = fs.readFileSync(dbPath, 'utf-8');
      db = JSON.parse(data);
    } catch (error) {
      console.error('Error loading database, initializing with mock data');
      initializeWithMockData();
    }
  } else {
    initializeWithMockData();
  }
}

function initializeWithMockData() {
  db.drivers = mockData.drivers.map((d: any) => ({
    ...d,
    id: d.id || uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  db.vehicles = mockData.vehicles.map((v: any) => ({
    ...v,
    id: v.id || uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  db.mills = mockData.mills?.map((m: any) => ({
    ...m,
    id: m.id || uuidv4(),
    location: {
      latitude: m.latitude,
      longitude: m.longitude,
      address: m.address,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })) || [];

  db.trips = mockData.trips?.map((t: any) => ({
    ...t,
    id: t.id || uuidv4(),
    millIds: mockData.tripMills?.filter((tm: any) => tm.tripId === t.id).map((tm: any) => tm.millId) || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })) || [];

  saveDatabase();
}

function saveDatabase() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

// Load on startup
loadDatabase();

export const jsonDb = {
  // Vehicles
  getVehicles: () => db.vehicles,
  getVehicleById: (id: string) => db.vehicles.find(v => v.id === id),
  addVehicle: (data: any) => {
    const vehicle = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.vehicles.push(vehicle);
    saveDatabase();
    return vehicle;
  },
  updateVehicle: (id: string, updates: any) => {
    const index = db.vehicles.findIndex(v => v.id === id);
    if (index === -1) return null;
    db.vehicles[index] = {
      ...db.vehicles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
    return db.vehicles[index];
  },
  deleteVehicle: (id: string) => {
    const index = db.vehicles.findIndex(v => v.id === id);
    if (index === -1) return false;
    db.vehicles.splice(index, 1);
    saveDatabase();
    return true;
  },

  // Drivers
  getDrivers: () => db.drivers,
  getDriverById: (id: string) => db.drivers.find(d => d.id === id),
  addDriver: (data: any) => {
    const driver = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.drivers.push(driver);
    saveDatabase();
    return driver;
  },
  updateDriver: (id: string, updates: any) => {
    const index = db.drivers.findIndex(d => d.id === id);
    if (index === -1) return null;
    db.drivers[index] = {
      ...db.drivers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
    return db.drivers[index];
  },
  deleteDriver: (id: string) => {
    const index = db.drivers.findIndex(d => d.id === id);
    if (index === -1) return false;
    db.drivers.splice(index, 1);
    saveDatabase();
    return true;
  },

  // Mills
  getMills: () => db.mills,
  getMillById: (id: string) => db.mills.find(m => m.id === id),
  addMill: (data: any) => {
    const mill = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.mills.push(mill);
    saveDatabase();
    return mill;
  },
  updateMill: (id: string, updates: any) => {
    const index = db.mills.findIndex(m => m.id === id);
    if (index === -1) return null;
    db.mills[index] = {
      ...db.mills[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
    return db.mills[index];
  },
  deleteMill: (id: string) => {
    const index = db.mills.findIndex(m => m.id === id);
    if (index === -1) return false;
    db.mills.splice(index, 1);
    saveDatabase();
    return true;
  },

  // Trips
  getTrips: () => db.trips,
  getTripById: (id: string) => db.trips.find(t => t.id === id),
  addTrip: (data: any) => {
    const trip = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.trips.push(trip);
    saveDatabase();
    return trip;
  },
  updateTrip: (id: string, updates: any) => {
    const index = db.trips.findIndex(t => t.id === id);
    if (index === -1) return null;
    db.trips[index] = {
      ...db.trips[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
    return db.trips[index];
  },
  deleteTrip: (id: string) => {
    const index = db.trips.findIndex(t => t.id === id);
    if (index === -1) return false;
    db.trips.splice(index, 1);
    saveDatabase();
    return true;
  },
};
