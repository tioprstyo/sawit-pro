import { db } from '../../../src/services/database';
import { VehicleType, VehicleStatus, DriverStatus } from '../../../src/types';
import { mockVehicle, mockDriver, mockMill } from '../../fixtures/mockData';

describe('Database Service', () => {
  beforeEach(() => {
    // Clear database before each test
    db.seedData();
  });

  describe('Vehicle Operations', () => {
    it('should get all vehicles', () => {
      const vehicles = db.getVehicles();

      expect(Array.isArray(vehicles)).toBe(true);
      expect(vehicles.length).toBeGreaterThan(0);
    });

    it('should get vehicle by ID', () => {
      const vehicles = db.getVehicles();
      const vehicle = db.getVehicleById(vehicles[0].id);

      expect(vehicle).toEqual(vehicles[0]);
    });

    it('should return undefined for non-existent vehicle', () => {
      const vehicle = db.getVehicleById('non-existent-id');

      expect(vehicle).toBeUndefined();
    });

    it('should add a new vehicle', () => {
      const before = db.getVehicles().length;

      const newVehicle = db.addVehicle({
        plateNumber: 'B-9999-ZZZ',
        type: VehicleType.FLATBED,
        capacity: 12,
        driverId: 'driver-1',
        status: VehicleStatus.ACTIVE,
      });

      const after = db.getVehicles().length;

      expect(after).toBe(before + 1);
      expect(newVehicle).toHaveProperty('id');
      expect(newVehicle).toHaveProperty('createdAt');
      expect(newVehicle.plateNumber).toBe('B-9999-ZZZ');
    });

    it('should update an existing vehicle', () => {
      const vehicles = db.getVehicles();
      const vehicleId = vehicles[0].id;

      const updated = db.updateVehicle(vehicleId, {
        status: VehicleStatus.MAINTENANCE,
      });

      expect(updated).not.toBeNull();
      expect(updated?.status).toBe(VehicleStatus.MAINTENANCE);
    });

    it('should return null when updating non-existent vehicle', () => {
      const updated = db.updateVehicle('non-existent-id', {
        status: VehicleStatus.MAINTENANCE,
      });

      expect(updated).toBeNull();
    });

    it('should delete a vehicle', () => {
      const vehicles = db.getVehicles();
      const vehicleId = vehicles[0].id;
      const before = vehicles.length;

      const deleted = db.deleteVehicle(vehicleId);
      const after = db.getVehicles().length;

      expect(deleted).toBe(true);
      expect(after).toBe(before - 1);
      expect(db.getVehicleById(vehicleId)).toBeUndefined();
    });

    it('should return false when deleting non-existent vehicle', () => {
      const deleted = db.deleteVehicle('non-existent-id');

      expect(deleted).toBe(false);
    });
  });

  describe('Driver Operations', () => {
    it('should get all drivers', () => {
      const drivers = db.getDrivers();

      expect(Array.isArray(drivers)).toBe(true);
      expect(drivers.length).toBeGreaterThan(0);
    });

    it('should add a new driver', () => {
      const newDriver = db.addDriver({
        name: 'New Driver',
        licenseNumber: 'DL999',
        phoneNumber: '08999999999',
        status: DriverStatus.AVAILABLE,
      });

      expect(newDriver).toHaveProperty('id');
      expect(newDriver.name).toBe('New Driver');
    });

    it('should update driver status', () => {
      const drivers = db.getDrivers();
      const driverId = drivers[0].id;

      const updated = db.updateDriver(driverId, {
        status: DriverStatus.ON_DUTY,
      });

      expect(updated?.status).toBe(DriverStatus.ON_DUTY);
    });
  });

  describe('Mill Operations', () => {
    it('should get all mills', () => {
      const mills = db.getMills();

      expect(Array.isArray(mills)).toBe(true);
      expect(mills.length).toBeGreaterThan(0);
    });

    it('should add a new mill', () => {
      const newMill = db.addMill({
        name: 'New Mill',
        location: {
          latitude: -6.1753,
          longitude: 106.8271,
          address: 'Test Address',
        },
        contactPerson: 'Test Person',
        phoneNumber: '02112345678',
        avgDailyProduction: 300,
      });

      expect(newMill).toHaveProperty('id');
      expect(newMill.name).toBe('New Mill');
      expect(newMill.avgDailyProduction).toBe(300);
    });
  });

  describe('Trip Operations', () => {
    it('should get all trips', () => {
      const trips = db.getTrips();

      expect(Array.isArray(trips)).toBe(true);
    });

    it('should add a new trip', () => {
      const vehicles = db.getVehicles();
      const drivers = db.getDrivers();
      const mills = db.getMills();

      const newTrip = db.addTrip({
        vehicleId: vehicles[0].id,
        driverId: drivers[0].id,
        millIds: [mills[0].id],
        scheduledDate: new Date(),
        status: 'scheduled',
        collections: [],
        estimatedDuration: 480,
      });

      expect(newTrip).toHaveProperty('id');
      expect(newTrip.vehicleId).toBe(vehicles[0].id);
    });
  });

  describe('Seed Data', () => {
    it('should create seed data', () => {
      const vehicles = db.getVehicles();
      const drivers = db.getDrivers();
      const mills = db.getMills();
      const trips = db.getTrips();

      expect(vehicles.length).toBeGreaterThan(0);
      expect(drivers.length).toBeGreaterThan(0);
      expect(mills.length).toBeGreaterThan(0);
      expect(trips.length).toBeGreaterThan(0);
    });

    it('should create valid relationships in seed data', () => {
      const vehicles = db.getVehicles();
      const drivers = db.getDrivers();
      const mills = db.getMills();
      const trips = db.getTrips();

      // Verify vehicle has valid driver
      vehicles.forEach(vehicle => {
        const driver = drivers.find(d => d.id === vehicle.driverId);
        expect(driver).toBeDefined();
      });

      // Verify trip has valid vehicle and driver
      trips.forEach(trip => {
        const vehicle = vehicles.find(v => v.id === trip.vehicleId);
        const driver = drivers.find(d => d.id === trip.driverId);
        expect(vehicle).toBeDefined();
        expect(driver).toBeDefined();

        // Verify trip has valid mills
        trip.millIds.forEach(millId => {
          const mill = mills.find(m => m.id === millId);
          expect(mill).toBeDefined();
        });
      });
    });
  });

  describe('Timestamps', () => {
    it('should set timestamps on created items', () => {
      const newVehicle = db.addVehicle({
        plateNumber: 'B-TEST-001',
        type: VehicleType.TRUCK,
        capacity: 12,
        driverId: 'driver-1',
        status: VehicleStatus.ACTIVE,
      });

      expect(newVehicle.createdAt).toBeInstanceOf(Date);
      expect(newVehicle.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt when item is modified', () => {
      const vehicles = db.getVehicles();
      const vehicleId = vehicles[0].id;
      const originalUpdatedAt = vehicles[0].updatedAt;

      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        const updated = db.updateVehicle(vehicleId, {
          status: VehicleStatus.MAINTENANCE,
        });

        expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
          originalUpdatedAt.getTime()
        );
      }, 10);
    });
  });
});
