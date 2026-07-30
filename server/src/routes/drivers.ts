import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/db.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const drivers = db.prepare('SELECT * FROM drivers ORDER BY createdAt DESC').all();
    res.json(drivers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const driver = db.prepare('SELECT * FROM drivers WHERE id = ?').get(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { name, licenseNumber, phoneNumber, status } = req.body;

    if (!name || !licenseNumber || !phoneNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO drivers (id, name, licenseNumber, phoneNumber, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, licenseNumber, phoneNumber, status || 'available', now, now);

    const driver = db.prepare('SELECT * FROM drivers WHERE id = ?').get(id);
    res.status(201).json(driver);
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'License number already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const { name, phoneNumber, status } = req.body;
    const now = new Date().toISOString();

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (phoneNumber !== undefined) {
      updates.push('phoneNumber = ?');
      values.push(phoneNumber);
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

    const query = `UPDATE drivers SET ${updates.join(', ')} WHERE id = ?`;
    const result = db.prepare(query).run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const driver = db.prepare('SELECT * FROM drivers WHERE id = ?').get(req.params.id);
    res.json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM drivers WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json({ message: 'Driver deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
