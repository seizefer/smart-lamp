import { Router, Request, Response } from 'express';

const router = Router();

// In-memory storage
let sleepSessions: any[] = [];

// GET all sleep sessions
router.get('/', (req: Request, res: Response) => {
  res.json(sleepSessions);
});

// GET sleep session by ID
router.get('/:id', (req: Request, res: Response) => {
  const session = sleepSessions.find((s) => s.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Sleep session not found' });
  }
  res.json(session);
});

// POST create new sleep session
router.post('/', (req: Request, res: Response) => {
  const session = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  sleepSessions.push(session);

  // Emit socket event
  const io = req.app.get('io');
  io.emit('sleep:created', session);

  res.status(201).json(session);
});

// GET sleep statistics
router.get('/stats/summary', (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 7;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const recentSessions = sleepSessions.filter(
    (s) => new Date(s.date) >= cutoff
  );

  const totalDuration = recentSessions.reduce((sum, s) => sum + s.duration, 0);
  const averageDuration = recentSessions.length > 0
    ? Math.round(totalDuration / recentSessions.length)
    : 0;

  const averageQuality = recentSessions.length > 0
    ? Math.round(
        recentSessions.reduce((sum, s) => sum + s.quality, 0) / recentSessions.length
      )
    : 0;

  const totalDeepSleep = recentSessions.reduce((sum, s) => sum + s.deepSleep, 0);
  const totalLightSleep = recentSessions.reduce((sum, s) => sum + s.lightSleep, 0);

  res.json({
    totalSessions: recentSessions.length,
    averageDuration,
    averageQuality,
    totalDeepSleep,
    totalLightSleep,
    sessions: recentSessions
  });
});

export default router;
