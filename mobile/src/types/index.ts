export interface Alarm {
  id: string;
  time: string; // HH:mm format
  enabled: boolean;
  repeat: RepeatDays;
  label: string;
  sound: string;
  vibrate: boolean;
  snooze: boolean;
  snoozeDuration: number; // minutes
  gradualVolume: boolean;
  lightEffect: boolean;
  lightSceneId?: string;
}

export interface RepeatDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface LightScene {
  id: string;
  name: string;
  brightness: number; // 0-100
  colorTemperature: number; // 2700-6500K
  color?: string; // hex color
  duration?: number; // transition duration in seconds
  isCustom: boolean;
}

export interface SleepSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  quality: number; // 0-100
  deepSleep: number; // minutes
  lightSleep: number; // minutes
  awake: number; // minutes
  interruptions: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  sunrise: string;
  sunset: string;
  icon: string;
}

export interface SoundTrack {
  id: string;
  name: string;
  type: 'white-noise' | 'nature' | 'ambient';
  file: string;
  duration?: number;
}

export interface UserSettings {
  use24Hour: boolean;
  darkMode: boolean;
  autoTheme: boolean;
  location: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  notifications: boolean;
  hapticFeedback: boolean;
  defaultSnooze: number;
  weekStartsOn: 'sunday' | 'monday';
}
