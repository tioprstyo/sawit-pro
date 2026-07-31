import express, { Request, Response } from 'express';
import { jsonDb } from '../database/jsondb.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const mills = jsonDb.getMills();
    res.json(mills);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const mill = jsonDb.getMillById(req.params.id);
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

    const mill = jsonDb.addMill({
      name,
      latitude,
      longitude,
      address,
      contactPerson: contactPerson || '',
      phoneNumber: phoneNumber || '',
      avgDailyProduction: avgDailyProduction || 0,
    });

    res.status(201).json(mill);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const mill = jsonDb.updateMill(req.params.id, req.body);
    if (!mill) {
      return res.status(404).json({ error: 'Mill not found' });
    }
    res.json(mill);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const success = jsonDb.deleteMill(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Mill not found' });
    }
    res.json({ message: 'Mill deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
