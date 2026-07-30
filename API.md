# API Documentation

## Overview

This document describes the data layer API and database operations available in the Fleet Manager system.

## Architecture

```
Components
    ↓
API Layer (src/api/index.ts)
    ↓
Database Service (src/services/database.ts)
    ↓
In-Memory Store
```

## API Endpoints

### Vehicles

#### Get All Vehicles
```typescript
api.vehicles.getAll(): Promise<Vehicle[]>
```

Returns an array of all vehicles in the fleet.

**Example**:
```typescript
const vehicles = await api.vehicles.getAll();
```

#### Get Vehicle by ID
```typescript
api.vehicles.getById(id: string): Promise<Vehicle | null>
```

Returns a specific vehicle by its ID, or null if not found.

**Example**:
```typescript
const vehicle = await api.vehicles.getById('vehicle-123');
```

#### Create Vehicle
```typescript
api.vehicles.create(data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle>
```

Creates a new vehicle and returns the created vehicle object.

**Parameters**:
- `plateNumber` (string, required): Vehicle registration plate number
- `type` (VehicleType, required): Type of vehicle (truck, tanker, flatbed)
- `capacity` (number, required): Load capacity in tons
- `driverId` (string, required): ID of assigned driver
- `status` (VehicleStatus, required): Current vehicle status

**Example**:
```typescript
const newVehicle = await api.vehicles.create({
  plateNumber: 'B-1234-ABC',
  type: 'truck',
  capacity: 12,
  driverId: 'driver-123',
  status: 'active'
});
```

#### Update Vehicle
```typescript
api.vehicles.update(id: string, data: Partial<Vehicle>): Promise<Vehicle | null>
```

Updates an existing vehicle. Returns updated vehicle or null if not found.

**Example**:
```typescript
const updated = await api.vehicles.update('vehicle-123', {
  status: 'maintenance'
});
```

#### Delete Vehicle
```typescript
api.vehicles.delete(id: string): Promise<boolean>
```

Deletes a vehicle. Returns true if successful, false if vehicle not found.

**Example**:
```typescript
const deleted = await api.vehicles.delete('vehicle-123');
```

### Drivers

#### Get All Drivers
```typescript
api.drivers.getAll(): Promise<Driver[]>
```

#### Get Driver by ID
```typescript
api.drivers.getById(id: string): Promise<Driver | null>
```

#### Create Driver
```typescript
api.drivers.create(data: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Promise<Driver>
```

**Parameters**:
- `name` (string, required): Driver's full name
- `licenseNumber` (string, required): Driving license number
- `phoneNumber` (string, required): Contact phone number
- `status` (DriverStatus, required): Current driver status

**Example**:
```typescript
const newDriver = await api.drivers.create({
  name: 'John Doe',
  licenseNumber: 'DL001',
  phoneNumber: '08123456789',
  status: 'available'
});
```

#### Update Driver
```typescript
api.drivers.update(id: string, data: Partial<Driver>): Promise<Driver | null>
```

#### Delete Driver
```typescript
api.drivers.delete(id: string): Promise<boolean>
```

### Mills

#### Get All Mills
```typescript
api.mills.getAll(): Promise<Mill[]>
```

#### Get Mill by ID
```typescript
api.mills.getById(id: string): Promise<Mill | null>
```

#### Create Mill
```typescript
api.mills.create(data: Omit<Mill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mill>
```

**Parameters**:
- `name` (string, required): Mill name
- `location` (GeoLocation, required): Geographic location with latitude, longitude, address
- `contactPerson` (string, required): Mill contact person name
- `phoneNumber` (string, required): Contact phone number
- `avgDailyProduction` (number, required): Average daily FFB production in tons

**Example**:
```typescript
const newMill = await api.mills.create({
  name: 'Mill A',
  location: {
    latitude: -6.1753,
    longitude: 106.8271,
    address: 'Jakarta, Indonesia'
  },
  contactPerson: 'Budi',
  phoneNumber: '02112345678',
  avgDailyProduction: 240
});
```

#### Update Mill
```typescript
api.mills.update(id: string, data: Partial<Mill>): Promise<Mill | null>
```

#### Delete Mill
```typescript
api.mills.delete(id: string): Promise<boolean>
```

### Trips

#### Get All Trips
```typescript
api.trips.getAll(): Promise<Trip[]>
```

#### Get Trip by ID
```typescript
api.trips.getById(id: string): Promise<Trip | null>
```

#### Create Trip
```typescript
api.trips.create(data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip>
```

**Parameters**:
- `vehicleId` (string, required): ID of assigned vehicle
- `driverId` (string, required): ID of assigned driver
- `millIds` (string[], required): Array of mill IDs for collection
- `scheduledDate` (Date, required): Scheduled date for the trip
- `status` (TripStatus, required): Current trip status
- `collections` (Collection[], required): Array of collections (initially empty)
- `estimatedDuration` (number, required): Estimated duration in minutes

**Example**:
```typescript
const newTrip = await api.trips.create({
  vehicleId: 'vehicle-123',
  driverId: 'driver-123',
  millIds: ['mill-1', 'mill-2'],
  scheduledDate: new Date('2026-07-31'),
  status: 'scheduled',
  collections: [],
  estimatedDuration: 480
});
```

#### Update Trip
```typescript
api.trips.update(id: string, data: Partial<Trip>): Promise<Trip | null>
```

Commonly updated fields:
- `status`: Change trip status (scheduled → in_progress → completed)
- `actualDuration`: Record actual time taken
- `startTime`: Record when trip started
- `endTime`: Record when trip ended
- `collections`: Add collection records

**Example**:
```typescript
const updated = await api.trips.update('trip-123', {
  status: 'in_progress',
  startTime: new Date()
});
```

#### Delete Trip
```typescript
api.trips.delete(id: string): Promise<boolean>
```

### Dashboard

#### Get Dashboard Summary
```typescript
api.dashboard.getSummary(): Promise<DashboardSummary>
```

Returns aggregated metrics for the fleet overview dashboard.

**Returns**:
```typescript
interface DashboardSummary {
  totalVehicles: number;           // Total vehicles in fleet
  activeVehicles: number;          // Vehicles with 'active' status
  availableDrivers: number;        // Drivers with 'available' status
  scheduledTrips: number;          // Trips with 'scheduled' status
  completedTrips: number;          // Trips with 'completed' status
  pendingCollections: number;      // Collections not yet completed
}
```

**Example**:
```typescript
const summary = await api.dashboard.getSummary();
console.log(`Total Vehicles: ${summary.totalVehicles}`);
console.log(`Active Vehicles: ${summary.activeVehicles}`);
console.log(`Scheduled Trips: ${summary.scheduledTrips}`);
```

## Data Models

### Vehicle
```typescript
interface Vehicle {
  id: string;
  plateNumber: string;
  type: 'truck' | 'tanker' | 'flatbed';
  capacity: number;
  driverId: string;
  status: 'active' | 'inactive' | 'maintenance' | 'in_use';
  createdAt: Date;
  updatedAt: Date;
}
```

### Driver
```typescript
interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phoneNumber: string;
  status: 'available' | 'on_duty' | 'off_duty' | 'on_leave';
  createdAt: Date;
  updatedAt: Date;
}
```

### Mill
```typescript
interface Mill {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  contactPerson: string;
  phoneNumber: string;
  avgDailyProduction: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Trip
```typescript
interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  millIds: string[];
  scheduledDate: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  collections: Collection[];
  estimatedDuration: number;
  actualDuration?: number;
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Collection
```typescript
interface Collection {
  id: string;
  tripId: string;
  millId: string;
  quantity: number;
  timestamp: Date;
}
```

## Error Handling

All API calls are asynchronous and may throw errors. Always use try-catch or promise .catch():

```typescript
try {
  const vehicle = await api.vehicles.getById('vehicle-123');
} catch (error) {
  console.error('Failed to fetch vehicle:', error);
}
```

## Usage with Redux

The API layer is typically used through Redux actions:

```typescript
// In a component
dispatch(setVehicleLoading(true));
try {
  const data = await api.vehicles.getAll();
  dispatch(setVehicles(data));
} catch (error) {
  dispatch(setVehicleError(error.message));
} finally {
  dispatch(setVehicleLoading(false));
}
```

## Custom Hooks

Use provided hooks for convenient data fetching:

```typescript
// In a component
const vehiclesState = useFetchVehicles();

// vehiclesState contains:
// - items: Vehicle[]
// - loading: boolean
// - error: string | null
```

Available hooks:
- `useFetchVehicles()`
- `useFetchDrivers()`
- `useFetchMills()`
- `useFetchTrips()`

## Database Initialization

The database includes seed data for testing:

```typescript
import { db } from '@/services/database';

// Initialize with seed data
db.seedData();

// Or access data directly
const allVehicles = db.getVehicles();
const allDrivers = db.getDrivers();
```

## Future Enhancements

### Planned Improvements
- REST API backend integration
- GraphQL support
- Real-time updates with WebSockets
- Pagination for large datasets
- Advanced filtering and sorting
- Batch operations

### Migration Path

To switch from in-memory to SQLite:
1. Update `api/index.ts` to call SQLite through Node.js backend
2. Implement SQLite schema matching current data models
3. Update error handling for database-specific errors
4. Add transaction support for atomic operations

## Performance Notes

- All API calls include a 50-100ms delay to simulate network latency
- In-memory storage supports 10,000+ records efficiently
- Dashboard summary aggregation is O(n) - optimize with database-level queries in production

## Support

For questions or issues with the API, refer to:
- ARCHITECTURE.md for design decisions
- Component source code for usage examples
- Unit tests for detailed API usage patterns
