import express, { Request, Response } from 'express';
import db from '../database/db.js';

const router = express.Router();

router.get('/summary', (req: Request, res: Response) => {
  try {
    const totalVehicles = (db.prepare('SELECT COUNT(*) as count FROM vehicles').get() as any).count;
    const activeVehicles = (db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'active'").get() as any).count;
    const availableDrivers = (db.prepare("SELECT COUNT(*) as count FROM drivers WHERE status = 'available'").get() as any).count;
    const scheduledTrips = (db.prepare("SELECT COUNT(*) as count FROM trips WHERE status = 'scheduled'").get() as any).count;
    const completedTrips = (db.prepare("SELECT COUNT(*) as count FROM trips WHERE status = 'completed'").get() as any).count;

    const pendingCollections = (db.prepare(`
      SELECT COUNT(*) as count FROM trip_mills tm
      WHERE tm.tripId IN (
        SELECT id FROM trips WHERE status != 'completed'
      )
    `).get() as any).count;

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
