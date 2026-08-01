import express, { Request, Response } from 'express';
import { sqliteDb } from '../database/sqlite-db.js';

const router = express.Router();

router.get('/summary', (req: Request, res: Response) => {
  try {
    const allVehicles = sqliteDb.getVehicles();
    const allDrivers = sqliteDb.getDrivers();
    const allTrips = sqliteDb.getTrips();

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
