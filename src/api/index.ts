import { db } from '../services/database';
import type { Vehicle, Driver, Mill, Trip, DashboardSummary } from '../types';
import { TripStatus, VehicleStatus, DriverStatus } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Vehicles
  vehicles: {
    getAll: async (): Promise<Vehicle[]> => {
      await delay(50);
      return db.getVehicles();
    },
    getById: async (id: string): Promise<Vehicle | null> => {
      await delay(50);
      return db.getVehicleById(id) || null;
    },
    create: async (data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> => {
      await delay(50);
      return db.addVehicle(data);
    },
    update: async (id: string, data: Partial<Vehicle>): Promise<Vehicle | null> => {
      await delay(50);
      return db.updateVehicle(id, data);
    },
    delete: async (id: string): Promise<boolean> => {
      await delay(50);
      return db.deleteVehicle(id);
    },
  },

  // Drivers
  drivers: {
    getAll: async (): Promise<Driver[]> => {
      await delay(50);
      return db.getDrivers();
    },
    getById: async (id: string): Promise<Driver | null> => {
      await delay(50);
      return db.getDriverById(id) || null;
    },
    create: async (data: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Promise<Driver> => {
      await delay(50);
      return db.addDriver(data);
    },
    update: async (id: string, data: Partial<Driver>): Promise<Driver | null> => {
      await delay(50);
      return db.updateDriver(id, data);
    },
    delete: async (id: string): Promise<boolean> => {
      await delay(50);
      return db.deleteDriver(id);
    },
  },

  // Mills
  mills: {
    getAll: async (): Promise<Mill[]> => {
      await delay(50);
      return db.getMills();
    },
    getById: async (id: string): Promise<Mill | null> => {
      await delay(50);
      return db.getMillById(id) || null;
    },
    create: async (data: Omit<Mill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mill> => {
      await delay(50);
      return db.addMill(data);
    },
    update: async (id: string, data: Partial<Mill>): Promise<Mill | null> => {
      await delay(50);
      return db.updateMill(id, data);
    },
    delete: async (id: string): Promise<boolean> => {
      await delay(50);
      return db.deleteMill(id);
    },
  },

  // Trips
  trips: {
    getAll: async (): Promise<Trip[]> => {
      await delay(50);
      return db.getTrips();
    },
    getById: async (id: string): Promise<Trip | null> => {
      await delay(50);
      return db.getTripById(id) || null;
    },
    create: async (data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> => {
      await delay(50);
      return db.addTrip(data);
    },
    update: async (id: string, data: Partial<Trip>): Promise<Trip | null> => {
      await delay(50);
      return db.updateTrip(id, data);
    },
    delete: async (id: string): Promise<boolean> => {
      await delay(50);
      return db.deleteTrip(id);
    },
  },

  // Dashboard
  dashboard: {
    getSummary: async (): Promise<DashboardSummary> => {
      await delay(100);
      const allVehicles = db.getVehicles();
      const allDrivers = db.getDrivers();
      const allTrips = db.getTrips();

      const activeVehicles = allVehicles.filter(v => v.status === VehicleStatus.ACTIVE).length;
      const availableDrivers = allDrivers.filter(d => d.status === DriverStatus.AVAILABLE).length;
      const scheduledTrips = allTrips.filter(t => t.status === TripStatus.SCHEDULED).length;
      const completedTrips = allTrips.filter(t => t.status === TripStatus.COMPLETED).length;

      let pendingCollections = 0;
      allTrips.forEach(trip => {
        if (trip.status !== TripStatus.COMPLETED) {
          trip.millIds.forEach(() => {
            pendingCollections++;
          });
        }
      });

      return {
        totalVehicles: allVehicles.length,
        activeVehicles,
        availableDrivers,
        scheduledTrips,
        completedTrips,
        pendingCollections,
      };
    },
  },
};
