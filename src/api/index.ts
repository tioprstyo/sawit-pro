import axios from 'axios';
import type { Vehicle, Driver, Mill, Trip, DashboardSummary } from '../types';

// Use environment variable if available, otherwise default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Vehicles
  vehicles: {
    getAll: async (): Promise<Vehicle[]> => {
      const response = await client.get('/vehicles');
      return response.data;
    },
    getById: async (id: string): Promise<Vehicle | null> => {
      try {
        const response = await client.get(`/vehicles/${id}`);
        return response.data;
      } catch {
        return null;
      }
    },
    create: async (data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> => {
      const response = await client.post('/vehicles', data);
      return response.data;
    },
    update: async (id: string, data: Partial<Vehicle>): Promise<Vehicle | null> => {
      try {
        const response = await client.put(`/vehicles/${id}`, data);
        return response.data;
      } catch {
        return null;
      }
    },
    delete: async (id: string): Promise<boolean> => {
      try {
        await client.delete(`/vehicles/${id}`);
        return true;
      } catch {
        return false;
      }
    },
  },

  // Drivers
  drivers: {
    getAll: async (): Promise<Driver[]> => {
      const response = await client.get('/drivers');
      return response.data;
    },
    getById: async (id: string): Promise<Driver | null> => {
      try {
        const response = await client.get(`/drivers/${id}`);
        return response.data;
      } catch {
        return null;
      }
    },
    create: async (data: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Promise<Driver> => {
      const response = await client.post('/drivers', data);
      return response.data;
    },
    update: async (id: string, data: Partial<Driver>): Promise<Driver | null> => {
      try {
        const response = await client.put(`/drivers/${id}`, data);
        return response.data;
      } catch {
        return null;
      }
    },
    delete: async (id: string): Promise<boolean> => {
      try {
        await client.delete(`/drivers/${id}`);
        return true;
      } catch {
        return false;
      }
    },
  },

  // Mills
  mills: {
    getAll: async (): Promise<Mill[]> => {
      const response = await client.get('/mills');
      return response.data;
    },
    getById: async (id: string): Promise<Mill | null> => {
      try {
        const response = await client.get(`/mills/${id}`);
        return response.data;
      } catch {
        return null;
      }
    },
    create: async (data: Omit<Mill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mill> => {
      const response = await client.post('/mills', data);
      return response.data;
    },
    update: async (id: string, data: Partial<Mill>): Promise<Mill | null> => {
      try {
        const response = await client.put(`/mills/${id}`, data);
        return response.data;
      } catch {
        return null;
      }
    },
    delete: async (id: string): Promise<boolean> => {
      try {
        await client.delete(`/mills/${id}`);
        return true;
      } catch {
        return false;
      }
    },
  },

  // Trips
  trips: {
    getAll: async (): Promise<Trip[]> => {
      const response = await client.get('/trips');
      return response.data;
    },
    getById: async (id: string): Promise<Trip | null> => {
      try {
        const response = await client.get(`/trips/${id}`);
        return response.data;
      } catch {
        return null;
      }
    },
    create: async (data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> => {
      const response = await client.post('/trips', data);
      return response.data;
    },
    update: async (id: string, data: Partial<Trip>): Promise<Trip | null> => {
      try {
        const response = await client.put(`/trips/${id}`, data);
        return response.data;
      } catch {
        return null;
      }
    },
    delete: async (id: string): Promise<boolean> => {
      try {
        await client.delete(`/trips/${id}`);
        return true;
      } catch {
        return false;
      }
    },
  },

  // Dashboard
  dashboard: {
    getSummary: async (): Promise<DashboardSummary> => {
      const response = await client.get('/dashboard/summary');
      return response.data;
    },
  },
};
