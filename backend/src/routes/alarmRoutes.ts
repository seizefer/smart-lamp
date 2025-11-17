import { Router, Request, Response } from 'express';

const router = Router();

// In-memory storage (replace with database in production)
let alarms: any[] = [];

// GET all alarms
router.get('/', (req: Request, res: Response) => {
  res.json(alarms);
});

// GET alarm by ID
router.get('/:id', (req: Request, res: Response) => {
  const alarm = alarms.find((a) => a.id === req.params.id);
  if (!alarm) {
    return res.status(404).json({ error: 'Alarm not found' });
  }
  res.json(alarm);
});

// POST create new alarm
router.post('/', (req: Request, res: Response) => {
  const alarm = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  alarms.push(alarm);

  // Emit socket event
  const io = req.app.get('io');
  io.emit('alarm:created', alarm);

  res.status(201).json(alarm);
});

// PUT update alarm
router.put('/:id', (req: Request, res: Response) => {
  const index = alarms.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Alarm not found' });
  }

  alarms[index] = {
    ...alarms[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  // Emit socket event
  const io = req.app.get('io');
  io.emit('alarm:updated', alarms[index]);

  res.json(alarms[index]);
});

// DELETE alarm
router.delete('/:id', (req: Request, res: Response) => {
  const index = alarms.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Alarm not found' });
  }

  const deleted = alarms.splice(index, 1)[0];

  // Emit socket event
  const io = req.app.get('io');
  io.emit('alarm:deleted', { id: req.params.id });

  res.json(deleted);
});

// POST toggle alarm
router.post('/:id/toggle', (req: Request, res: Response) => {
  const alarm = alarms.find((a) => a.id === req.params.id);
  if (!alarm) {
    return res.status(404).json({ error: 'Alarm not found' });
  }

  alarm.enabled = !alarm.enabled;
  alarm.updatedAt = new Date().toISOString();

  // Emit socket event
  const io = req.app.get('io');
  io.emit('alarm:toggled', alarm);

  res.json(alarm);
});

export default router;
