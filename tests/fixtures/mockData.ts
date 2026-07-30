import type { Vehicle, Driver, Mill, Trip } from '../../src/types';
import { VehicleType, VehicleStatus, DriverStatus, TripStatus } from '../../src/types';

export const mockDriver: Driver = {
  id: 'driver-1',
  name: 'John Doe',
  licenseNumber: 'DL001',
  phoneNumber: '08123456789',
  status: DriverStatus.AVAILABLE,
  createdAt: new Date('2026-07-30'),
  updatedAt: new Date('2026-07-30'),
};

export const mockDrivers: Driver[] = [
  mockDriver,
  {
    id: 'driver-2',
    name: 'Jane Smith',
    licenseNumber: 'DL002',
    phoneNumber: '08198765432',
    status: DriverStatus.AVAILABLE,
    createdAt: new Date('2026-07-30'),
    updatedAt: new Date('2026-07-30'),
  },
];

export const mockVehicle: Vehicle = {
  id: 'vehicle-1',
  plateNumber: 'B-1234-ABC',
  type: VehicleType.TRUCK,
  capacity: 12,
  driverId: 'driver-1',
  status: VehicleStatus.ACTIVE,
  createdAt: new Date('2026-07-30'),
  updatedAt: new Date('2026-07-30'),
};

export const mockVehicles: Vehicle[] = [
  mockVehicle,
  {
    id: 'vehicle-2',
    plateNumber: 'B-5678-DEF',
    type: VehicleType.TANKER,
    capacity: 12,
    driverId: 'driver-2',
    status: VehicleStatus.ACTIVE,
    createdAt: new Date('2026-07-30'),
    updatedAt: new Date('2026-07-30'),
  },
];

export const mockMill: Mill = {
  id: 'mill-1',
  name: 'Mill A',
  location: {
    latitude: -6.1753,
    longitude: 106.8271,
    address: 'Jakarta, Indonesia',
  },
  contactPerson: 'Budi',
  phoneNumber: '02112345678',
  avgDailyProduction: 240,
  createdAt: new Date('2026-07-30'),
  updatedAt: new Date('2026-07-30'),
};

export const mockMills: Mill[] = [
  mockMill,
  {
    id: 'mill-2',
    name: 'Mill B',
    location: {
      latitude: -6.2088,
      longitude: 106.8456,
      address: 'South Jakarta, Indonesia',
    },
    contactPerson: 'Siti',
    phoneNumber: '02187654321',
    avgDailyProduction: 240,
    createdAt: new Date('2026-07-30'),
    updatedAt: new Date('2026-07-30'),
  },
];

export const mockTrip: Trip = {
  id: 'trip-1',
  vehicleId: 'vehicle-1',
  driverId: 'driver-1',
  millIds: ['mill-1', 'mill-2'],
  scheduledDate: new Date('2026-07-31'),
  status: TripStatus.SCHEDULED,
  collections: [],
  estimatedDuration: 480,
  createdAt: new Date('2026-07-30'),
  updatedAt: new Date('2026-07-30'),
};

export const mockTrips: Trip[] = [
  mockTrip,
  {
    id: 'trip-2',
    vehicleId: 'vehicle-2',
    driverId: 'driver-2',
    millIds: ['mill-1'],
    scheduledDate: new Date('2026-07-31'),
    status: TripStatus.SCHEDULED,
    collections: [],
    estimatedDuration: 240,
    createdAt: new Date('2026-07-30'),
    updatedAt: new Date('2026-07-30'),
  },
];
