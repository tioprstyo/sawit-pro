export const VehicleType = {
  TRUCK: 'truck',
  TANKER: 'tanker',
  FLATBED: 'flatbed',
} as const;
export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType];

export const VehicleStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  IN_USE: 'in_use',
} as const;
export type VehicleStatus = (typeof VehicleStatus)[keyof typeof VehicleStatus];

export const DriverStatus = {
  AVAILABLE: 'available',
  ON_DUTY: 'on_duty',
  OFF_DUTY: 'off_duty',
  ON_LEAVE: 'on_leave',
} as const;
export type DriverStatus = (typeof DriverStatus)[keyof typeof DriverStatus];

export const TripStatus = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;
export type TripStatus = (typeof TripStatus)[keyof typeof TripStatus];

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: VehicleType;
  capacity: number;
  driverId: string;
  status: VehicleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phoneNumber: string;
  status: DriverStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Mill {
  id: string;
  name: string;
  location: GeoLocation;
  contactPerson: string;
  phoneNumber: string;
  avgDailyProduction: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  tripId: string;
  millId: string;
  quantity: number;
  timestamp: Date;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  millIds: string[];
  scheduledDate: Date;
  status: TripStatus;
  collections: Collection[];
  estimatedDuration: number;
  actualDuration?: number;
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardSummary {
  totalVehicles: number;
  activeVehicles: number;
  availableDrivers: number;
  scheduledTrips: number;
  completedTrips: number;
  pendingCollections: number;
}
