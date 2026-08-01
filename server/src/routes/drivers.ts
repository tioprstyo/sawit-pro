import express, { Request, Response } from 'express';
import { sqliteDb } from '../database/sqlite-db.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const drivers = sqliteDb.getDrivers();
    res.json(drivers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const driver = sqliteDb.getDriverById(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { id, name, licenseNumber, phoneNumber, status } = req.body;

    if (!name || !licenseNumber || !phoneNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const driver = sqliteDb.addDriver({
      id,
      name,
      licenseNumber,
      phoneNumber,
      status: status || 'available',
    });

    res.status(201).json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const driver = sqliteDb.updateDriver(req.params.id, req.body);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const success = sqliteDb.deleteDriver(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json({ message: 'Driver deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
