import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/db.js';

const router = express.Router();

// Get all vehicles
router.get('/', (req: Request, res: Response) => {
  try {
    const vehicles = db.prepare(`
      SELECT v.*, d.name as driverName
      FROM vehicles v
      LEFT JOIN drivers d ON v.driverId = d.id
      ORDER BY v.createdAt DESC
    `).all();

    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get vehicle by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const vehicle = db.prepare(`
      SELECT v.*, d.name as driverName
      FROM vehicles v
      LEFT JOIN drivers d ON v.driverId = d.id
      WHERE v.id = ?
    `).get(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
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

    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO vehicles (id, plateNumber, type, capacity, driverId, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, plateNumber, type, capacity, driverId, status || 'active', now, now);

    const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
    res.status(201).json(vehicle);
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Plate number already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update vehicle
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { plateNumber, type, capacity, driverId, status } = req.body;
    const now = new Date().toISOString();

    const updates: string[] = [];
    const values: any[] = [];

    if (plateNumber !== undefined) {
      updates.push('plateNumber = ?');
      values.push(plateNumber);
    }
    if (type !== undefined) {
      updates.push('type = ?');
      values.push(type);
    }
    if (capacity !== undefined) {
      updates.push('capacity = ?');
      values.push(capacity);
    }
    if (driverId !== undefined) {
      updates.push('driverId = ?');
      values.push(driverId);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = ?');
    values.push(now);
    values.push(req.params.id);

    const query = `UPDATE vehicles SET ${updates.join(', ')} WHERE id = ?`;
    const result = db.prepare(query).run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete vehicle
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM vehicles WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
