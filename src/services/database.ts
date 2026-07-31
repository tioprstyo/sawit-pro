import type { Vehicle, Driver, Mill, Trip } from '../types';
import { VehicleType, DriverStatus, VehicleStatus, TripStatus } from '../types';
import { mockData } from '../utils/mock-data';

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

    // Add all drivers from mockData - preserve original IDs
    for (const driverData of mockData.drivers) {
      const newDriver: Driver = {
        id: driverData.id,
        name: driverData.name,
        licenseNumber: driverData.licenseNumber,
        phoneNumber: driverData.phoneNumber,
        status: driverData.status as DriverStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      drivers.push(newDriver);
    }

    // Add all vehicles from mockData - preserve original IDs
    for (const vehicleData of mockData.vehicles) {
      const newVehicle: Vehicle = {
        id: vehicleData.id,
        plateNumber: vehicleData.plateNumber,
        type: vehicleData.type as VehicleType,
        capacity: vehicleData.capacity,
        driverId: vehicleData.driverId,
        status: vehicleData.status as VehicleStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vehicles.push(newVehicle);
    }

    // Add all mills from mockData - preserve original IDs
    if (mockData.mills && mockData.mills.length > 0) {
      for (const millData of mockData.mills) {
        const newMill: Mill = {
          id: millData.id,
          name: millData.name,
          location: {
            latitude: millData.latitude,
            longitude: millData.longitude,
            address: millData.address,
          },
          contactPerson: millData.contactPerson,
          phoneNumber: millData.phoneNumber,
          avgDailyProduction: millData.avgDailyProduction,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mills.push(newMill);
      }
    }

    // Add all trips from mockData - preserve original IDs
    if (mockData.trips && mockData.trips.length > 0) {
      for (const tripData of mockData.trips) {
        const tripMills = mockData.tripMills
          ?.filter(tm => tm.tripId === tripData.id)
          .map(tm => tm.millId) || [];

        const newTrip: Trip = {
          id: tripData.id,
          vehicleId: tripData.vehicleId,
          driverId: tripData.driverId,
          millIds: tripMills,
          scheduledDate: new Date(tripData.scheduledDate),
          status: tripData.status as TripStatus,
          collections: [],
          estimatedDuration: tripData.estimatedDuration,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        trips.push(newTrip);
      }
    }
  },
};
