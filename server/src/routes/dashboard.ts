import express, { Request, Response } from 'express';
import { jsonDb } from '../database/jsondb.js';

const router = express.Router();

router.get('/summary', (req: Request, res: Response) => {
  try {
    const allVehicles = jsonDb.getVehicles();
    const allDrivers = jsonDb.getDrivers();
    const allTrips = jsonDb.getTrips();

    const totalVehicles = allVehicles.length;
    const activeVehicles = allVehicles.filter((v: any) => v.status === 'active').length;
    const availableDrivers = allDrivers.filter((d: any) => d.status === 'available').length;
    const scheduledTrips = allTrips.filter((t: any) => t.status === 'scheduled').length;
    const completedTrips = allTrips.filter((t: any) => t.status === 'completed').length;

    let pendingCollections = 0;
    allTrips.forEach((trip: any) => {
      if (trip.status !== 'completed') {
        pendingCollections += trip.millIds?.length || 0;
      }
    });

    res.json({
      totalVehicles,
      activeVehicles,
      availableDrivers,
      scheduledTrips,
      completedTrips,
      pendingCollections,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
