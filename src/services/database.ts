import type { Vehicle, Driver, Mill, Trip } from '../types';
import { VehicleType, DriverStatus, VehicleStatus, TripStatus } from '../types';

let vehicles: Vehicle[] = [];
let drivers: Driver[] = [];
let mills: Mill[] = [];
let trips: Trip[] = [];

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const db = {
  // Vehicles
  getVehicles: (): Vehicle[] => vehicles,
  getVehicleById: (id: string): Vehicle | undefined => vehicles.find(v => v.id === id),
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Vehicle => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vehicles.push(newVehicle);
    return newVehicle;
  },
  updateVehicle: (id: string, updates: Partial<Vehicle>): Vehicle | null => {
    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) return null;
    vehicles[index] = {
      ...vehicles[index],
      ...updates,
      updatedAt: new Date(),
    };
    return vehicles[index];
  },
  deleteVehicle: (id: string): boolean => {
    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) return false;
    vehicles.splice(index, 1);
    return true;
  },

  // Drivers
  getDrivers: (): Driver[] => drivers,
  getDriverById: (id: string): Driver | undefined => drivers.find(d => d.id === id),
  addDriver: (driver: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Driver => {
    const newDriver: Driver = {
      ...driver,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    drivers.push(newDriver);
    return newDriver;
  },
  updateDriver: (id: string, updates: Partial<Driver>): Driver | null => {
    const index = drivers.findIndex(d => d.id === id);
    if (index === -1) return null;
    drivers[index] = {
      ...drivers[index],
      ...updates,
      updatedAt: new Date(),
    };
    return drivers[index];
  },
  deleteDriver: (id: string): boolean => {
    const index = drivers.findIndex(d => d.id === id);
    if (index === -1) return false;
    drivers.splice(index, 1);
    return true;
  },

  // Mills
  getMills: (): Mill[] => mills,
  getMillById: (id: string): Mill | undefined => mills.find(m => m.id === id),
  addMill: (mill: Omit<Mill, 'id' | 'createdAt' | 'updatedAt'>): Mill => {
    const newMill: Mill = {
      ...mill,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mills.push(newMill);
    return newMill;
  },
  updateMill: (id: string, updates: Partial<Mill>): Mill | null => {
    const index = mills.findIndex(m => m.id === id);
    if (index === -1) return null;
    mills[index] = {
      ...mills[index],
      ...updates,
      updatedAt: new Date(),
    };
    return mills[index];
  },
  deleteMill: (id: string): boolean => {
    const index = mills.findIndex(m => m.id === id);
    if (index === -1) return false;
    mills.splice(index, 1);
    return true;
  },

  // Trips
  getTrips: (): Trip[] => trips,
  getTripById: (id: string): Trip | undefined => trips.find(t => t.id === id),
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Trip => {
    const newTrip: Trip = {
      ...trip,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    trips.push(newTrip);
    return newTrip;
  },
  updateTrip: (id: string, updates: Partial<Trip>): Trip | null => {
    const index = trips.findIndex(t => t.id === id);
    if (index === -1) return null;
    trips[index] = {
      ...trips[index],
      ...updates,
      updatedAt: new Date(),
    };
    return trips[index];
  },
  deleteTrip: (id: string): boolean => {
    const index = trips.findIndex(t => t.id === id);
    if (index === -1) return false;
    trips.splice(index, 1);
    return true;
  },

  // Seed data for testing
  seedData: () => {
    // Clear existing data
    vehicles = [];
    drivers = [];
    mills = [];
    trips = [];

    // Add sample drivers
    const driver1 = db.addDriver({
      name: 'John Doe',
      licenseNumber: 'DL001',
      phoneNumber: '08123456789',
      status: DriverStatus.AVAILABLE,
    });

    const driver2 = db.addDriver({
      name: 'Jane Smith',
      licenseNumber: 'DL002',
      phoneNumber: '08198765432',
      status: DriverStatus.AVAILABLE,
    });

    // Add sample vehicles
    const vehicle1 = db.addVehicle({
      plateNumber: 'B-1234-ABC',
      type: VehicleType.TRUCK,
      capacity: 12,
      driverId: driver1.id,
      status: VehicleStatus.ACTIVE,
    });

    db.addVehicle({
      plateNumber: 'B-5678-DEF',
      type: VehicleType.TANKER,
      capacity: 12,
      driverId: driver2.id,
      status: VehicleStatus.ACTIVE,
    });

    // Add sample mills
    const mill1 = db.addMill({
      name: 'Mill A',
      location: {
        latitude: -6.1753,
        longitude: 106.8271,
        address: 'Jakarta, Indonesia',
      },
      contactPerson: 'Budi',
      phoneNumber: '02112345678',
      avgDailyProduction: 240,
    });

    const mill2 = db.addMill({
      name: 'Mill B',
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: 'South Jakarta, Indonesia',
      },
      contactPerson: 'Siti',
      phoneNumber: '02187654321',
      avgDailyProduction: 240,
    });

    // Add sample trips
    db.addTrip({
      vehicleId: vehicle1.id,
      driverId: driver1.id,
      millIds: [mill1.id, mill2.id],
      scheduledDate: new Date(),
      status: TripStatus.SCHEDULED,
      collections: [],
      estimatedDuration: 480,
    });
  },
};
