import axios from 'axios';
import { WeatherData } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export class WeatherService {
  static async getCurrentWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather`, {
        params: { lat: latitude, lon: longitude }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Return mock data on error
      return {
        temperature: 22,
        condition: 'Partly Cloudy',
        humidity: 65,
        sunrise: '06:30',
        sunset: '18:45',
        icon: '⛅'
      };
    }
  }

  static async getSunTimes(
    latitude: number,
    longitude: number
  ): Promise<{ sunrise: string; sunset: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/sun`, {
        params: { lat: latitude, lon: longitude }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching sun times:', error);
      return {
        sunrise: '06:30',
        sunset: '18:45'
      };
    }
  }

  static getWeatherIcon(condition: string): string {
    const iconMap: { [key: string]: string } = {
      'clear': '☀️',
      'sunny': '☀️',
      'partly cloudy': '⛅',
      'cloudy': '☁️',
      'overcast': '☁️',
      'rain': '🌧️',
      'drizzle': '🌦️',
      'thunderstorm': '⛈️',
      'snow': '🌨️',
      'fog': '🌫️',
      'mist': '🌫️'
    };

    const normalizedCondition = condition.toLowerCase();
    return iconMap[normalizedCondition] || '⛅';
  }
}
