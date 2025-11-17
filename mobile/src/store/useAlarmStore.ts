import { create } from 'zustand';
import { Alarm } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AlarmStore {
  alarms: Alarm[];
  addAlarm: (alarm: Alarm) => void;
  updateAlarm: (id: string, alarm: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  loadAlarms: () => Promise<void>;
  saveAlarms: () => Promise<void>;
}

export const useAlarmStore = create<AlarmStore>((set, get) => ({
  alarms: [],

  addAlarm: (alarm) => {
    set((state) => ({
      alarms: [...state.alarms, alarm]
    }));
    get().saveAlarms();
  },

  updateAlarm: (id, updates) => {
    set((state) => ({
      alarms: state.alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, ...updates } : alarm
      )
    }));
    get().saveAlarms();
  },

  deleteAlarm: (id) => {
    set((state) => ({
      alarms: state.alarms.filter((alarm) => alarm.id !== id)
    }));
    get().saveAlarms();
  },

  toggleAlarm: (id) => {
    set((state) => ({
      alarms: state.alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    }));
    get().saveAlarms();
  },

  loadAlarms: async () => {
    try {
      const stored = await AsyncStorage.getItem('alarms');
      if (stored) {
        set({ alarms: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load alarms:', error);
    }
  },

  saveAlarms: async () => {
    try {
      await AsyncStorage.setItem('alarms', JSON.stringify(get().alarms));
    } catch (error) {
      console.error('Failed to save alarms:', error);
    }
  }
}));
