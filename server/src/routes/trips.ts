import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/db.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const trips = db.prepare(`
      SELECT t.*, v.plateNumber, d.name as driverName
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicleId = v.id
      LEFT JOIN drivers d ON t.driverId = d.id
      ORDER BY t.scheduledDate DESC
    `).all();

    // Get mills for each trip
    const tripsWithMills = trips.map((trip: any) => {
      const mills = db.prepare(`
        SELECT m.*, tm.collectionOrder
        FROM trip_mills tm
        JOIN mills m ON tm.millId = m.id
        WHERE tm.tripId = ?
        ORDER BY tm.collectionOrder
      `).all(trip.id);

      return { ...trip, mills };
    });

    res.json(tripsWithMills);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const trip = db.prepare(`
      SELECT t.*, v.plateNumber, d.name as driverName
      FROM trips t
      LEFT JOIN vehicles v ON t.vehicleId = v.id
      LEFT JOIN drivers d ON t.driverId = d.id
      WHERE t.id = ?
    `).get(req.params.id);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const mills = db.prepare(`
      SELECT m.*, tm.collectionOrder
      FROM trip_mills tm
      JOIN mills m ON tm.millId = m.id
      WHERE tm.tripId = ?
      ORDER BY tm.collectionOrder
    `).all(req.params.id);

    res.json({ ...trip, mills });
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

    const id = uuidv4();
    const now = new Date().toISOString();

    const insertTrip = db.prepare(`
      INSERT INTO trips (id, vehicleId, driverId, scheduledDate, status, estimatedDuration, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertTripMill = db.prepare(`
      INSERT INTO trip_mills (tripId, millId, collectionOrder)
      VALUES (?, ?, ?)
    `);

    insertTrip.run(id, vehicleId, driverId, scheduledDate, status || 'scheduled', estimatedDuration || 480, now, now);

    millIds.forEach((millId: string, index: number) => {
      insertTripMill.run(id, millId, index + 1);
    });

    const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(id);
    const mills = db.prepare(`
      SELECT m.*, tm.collectionOrder
      FROM trip_mills tm
      JOIN mills m ON tm.millId = m.id
      WHERE tm.tripId = ?
      ORDER BY tm.collectionOrder
    `).all(id);

    res.status(201).json({ ...trip, mills });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const { status, actualDuration, startTime, endTime } = req.body;
    const now = new Date().toISOString();

    const updates: string[] = [];
    const values: any[] = [];

    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (actualDuration !== undefined) {
      updates.push('actualDuration = ?');
      values.push(actualDuration);
    }
    if (startTime !== undefined) {
      updates.push('startTime = ?');
      values.push(startTime);
    }
    if (endTime !== undefined) {
      updates.push('endTime = ?');
      values.push(endTime);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = ?');
    values.push(now);
    values.push(req.params.id);

    const query = `UPDATE trips SET ${updates.join(', ')} WHERE id = ?`;
    const result = db.prepare(query).run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
    res.json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM trips WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ message: 'Trip deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
