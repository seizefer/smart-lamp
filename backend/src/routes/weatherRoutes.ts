import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// Mock weather data for development
const mockWeatherData = {
  temperature: 22,
  condition: 'Partly Cloudy',
  humidity: 65,
  sunrise: '06:30',
  sunset: '18:45',
  icon: '⛅'
};

// GET current weather
router.get('/', async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;

    // In production, use a real weather API like OpenWeatherMap
    // const apiKey = process.env.WEATHER_API_KEY;
    // const response = await axios.get(
    //   `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    // );

    // For now, return mock data
    res.json(mockWeatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// GET sunrise/sunset times
router.get('/sun', async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;

    // Calculate approximate sunrise/sunset based on location
    // In production, use a proper API or library
    const now = new Date();
    const sunrise = new Date(now);
    sunrise.setHours(6, 30, 0, 0);

    const sunset = new Date(now);
    sunset.setHours(18, 45, 0, 0);

    res.json({
      sunrise: sunrise.toISOString(),
      sunset: sunset.toISOString()
    });
  } catch (error) {
    console.error('Sun time calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate sun times' });
  }
});

export default router;
