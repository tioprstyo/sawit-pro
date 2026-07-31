import express, { Request, Response } from 'express';
import { jsonDb } from '../database/jsondb.js';

const router = express.Router();

// Get all vehicles
router.get('/', (req: Request, res: Response) => {
  try {
    const vehicles = jsonDb.getVehicles().map((v: any) => {
      const driver = jsonDb.getDriverById(v.driverId);
      return { ...v, driverName: driver?.name || 'N/A' };
    });
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get vehicle by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const vehicle = jsonDb.getVehicleById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    const driver = jsonDb.getDriverById(vehicle.driverId);
    res.json({ ...vehicle, driverName: driver?.name || 'N/A' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create vehicle
router.post('/', (req: Request, res: Response) => {
  try {
    const { plateNumber, type, capacity, driverId, status } = req.body;

    // Validation
    if (!plateNumber || !type || !capacity || !driverId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const vehicle = jsonDb.addVehicle({
      plateNumber,
      type,
      capacity,
      driverId,
      status: status || 'active',
    });

    res.status(201).json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update vehicle
router.put('/:id', (req: Request, res: Response) => {
  try {
    const vehicle = jsonDb.updateVehicle(req.params.id, req.body);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete vehicle
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const success = jsonDb.deleteVehicle(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
