import express, { Request, Response } from 'express';
import { jsonDb } from '../database/jsondb.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const trips = jsonDb.getTrips().map((trip: any) => {
      const vehicle = jsonDb.getVehicleById(trip.vehicleId);
      const driver = jsonDb.getDriverById(trip.driverId);
      const mills = trip.millIds?.map((millId: string) => jsonDb.getMillById(millId)).filter(Boolean) || [];
      return {
        ...trip,
        plateNumber: vehicle?.plateNumber,
        driverName: driver?.name,
        mills,
      };
    });
    res.json(trips);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const trip = jsonDb.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    const vehicle = jsonDb.getVehicleById(trip.vehicleId);
    const driver = jsonDb.getDriverById(trip.driverId);
    const mills = trip.millIds?.map((millId: string) => jsonDb.getMillById(millId)).filter(Boolean) || [];
    res.json({
      ...trip,
      plateNumber: vehicle?.plateNumber,
      driverName: driver?.name,
      mills,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { vehicleId, driverId, scheduledDate, millIds, status, estimatedDuration } = req.body;

    if (!vehicleId || !driverId || !scheduledDate || !millIds || !Array.isArray(millIds)) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    const trip = jsonDb.addTrip({
      vehicleId,
      driverId,
      scheduledDate,
      millIds,
      status: status || 'scheduled',
      estimatedDuration: estimatedDuration || 480,
      collections: [],
    });

    const vehicle = jsonDb.getVehicleById(trip.vehicleId);
    const driver = jsonDb.getDriverById(trip.driverId);
    const mills = trip.millIds?.map((millId: string) => jsonDb.getMillById(millId)).filter(Boolean) || [];

    res.status(201).json({
      ...trip,
      plateNumber: vehicle?.plateNumber,
      driverName: driver?.name,
      mills,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const trip = jsonDb.updateTrip(req.params.id, req.body);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    const vehicle = jsonDb.getVehicleById(trip.vehicleId);
    const driver = jsonDb.getDriverById(trip.driverId);
    const mills = trip.millIds?.map((millId: string) => jsonDb.getMillById(millId)).filter(Boolean) || [];
    res.json({
      ...trip,
      plateNumber: vehicle?.plateNumber,
      driverName: driver?.name,
      mills,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const success = jsonDb.deleteTrip(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
