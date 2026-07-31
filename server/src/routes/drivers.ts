import express, { Request, Response } from 'express';
import { jsonDb } from '../database/jsondb.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const drivers = jsonDb.getDrivers();
    res.json(drivers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const driver = jsonDb.getDriverById(req.params.id);
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

    const driver = jsonDb.addDriver({
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
    const driver = jsonDb.updateDriver(req.params.id, req.body);
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
    const success = jsonDb.deleteDriver(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json({ message: 'Driver deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
