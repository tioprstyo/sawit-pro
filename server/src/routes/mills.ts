import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/db.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const mills = db.prepare('SELECT * FROM mills ORDER BY createdAt DESC').all();
    res.json(mills);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const mill = db.prepare('SELECT * FROM mills WHERE id = ?').get(req.params.id);
    if (!mill) return res.status(404).json({ error: 'Mill not found' });
    res.json(mill);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { name, latitude, longitude, address, contactPerson, phoneNumber, avgDailyProduction } = req.body;

    if (!name || latitude === undefined || longitude === undefined || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO mills (id, name, latitude, longitude, address, contactPerson, phoneNumber, avgDailyProduction, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, latitude, longitude, address, contactPerson || '', phoneNumber || '', avgDailyProduction || 0, now, now);

    const mill = db.prepare('SELECT * FROM mills WHERE id = ?').get(id);
    res.status(201).json(mill);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const { name, latitude, longitude, address, contactPerson, phoneNumber, avgDailyProduction } = req.body;
    const now = new Date().toISOString();

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (latitude !== undefined) {
      updates.push('latitude = ?');
      values.push(latitude);
    }
    if (longitude !== undefined) {
      updates.push('longitude = ?');
      values.push(longitude);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      values.push(address);
    }
    if (contactPerson !== undefined) {
      updates.push('contactPerson = ?');
      values.push(contactPerson);
    }
    if (phoneNumber !== undefined) {
      updates.push('phoneNumber = ?');
      values.push(phoneNumber);
    }
    if (avgDailyProduction !== undefined) {
      updates.push('avgDailyProduction = ?');
      values.push(avgDailyProduction);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = ?');
    values.push(now);
    values.push(req.params.id);

    const query = `UPDATE mills SET ${updates.join(', ')} WHERE id = ?`;
    const result = db.prepare(query).run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Mill not found' });
    }

    const mill = db.prepare('SELECT * FROM mills WHERE id = ?').get(req.params.id);
    res.json(mill);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM mills WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Mill not found' });
    }

    res.json({ message: 'Mill deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
