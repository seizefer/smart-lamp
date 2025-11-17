import { Router, Request, Response } from 'express';

const router = Router();

// Light state
let lightState = {
  isOn: false,
  brightness: 50,
  colorTemperature: 4000,
  currentScene: null,
  lastUpdated: new Date().toISOString()
};

// GET light state
router.get('/', (req: Request, res: Response) => {
  res.json(lightState);
});

// POST update light state
router.post('/state', (req: Request, res: Response) => {
  lightState = {
    ...lightState,
    ...req.body,
    lastUpdated: new Date().toISOString()
  };

  // Emit socket event
  const io = req.app.get('io');
  io.emit('light:update', lightState);

  res.json(lightState);
});

// POST toggle light
router.post('/toggle', (req: Request, res: Response) => {
  lightState.isOn = !lightState.isOn;
  lightState.lastUpdated = new Date().toISOString();

  // Emit socket event
  const io = req.app.get('io');
  io.emit('light:update', lightState);

  res.json(lightState);
});

// POST set brightness
router.post('/brightness', (req: Request, res: Response) => {
  const { brightness } = req.body;

  if (brightness < 0 || brightness > 100) {
    return res.status(400).json({ error: 'Brightness must be between 0 and 100' });
  }

  lightState.brightness = brightness;
  lightState.lastUpdated = new Date().toISOString();

  // Emit socket event
  const io = req.app.get('io');
  io.emit('light:update', lightState);

  res.json(lightState);
});

// POST set color temperature
router.post('/temperature', (req: Request, res: Response) => {
  const { colorTemperature } = req.body;

  if (colorTemperature < 2000 || colorTemperature > 6500) {
    return res.status(400).json({ error: 'Color temperature must be between 2000K and 6500K' });
  }

  lightState.colorTemperature = colorTemperature;
  lightState.lastUpdated = new Date().toISOString();

  // Emit socket event
  const io = req.app.get('io');
  io.emit('light:update', lightState);

  res.json(lightState);
});

// POST apply scene
router.post('/scene', (req: Request, res: Response) => {
  const { scene } = req.body;

  lightState = {
    ...lightState,
    brightness: scene.brightness,
    colorTemperature: scene.colorTemperature,
    currentScene: scene,
    isOn: true,
    lastUpdated: new Date().toISOString()
  };

  // Emit socket event
  const io = req.app.get('io');
  io.emit('light:update', lightState);

  res.json(lightState);
});

export default router;
