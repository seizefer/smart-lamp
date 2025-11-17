import { create } from 'zustand';
import { SleepSession } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SleepStore {
  sessions: SleepSession[];
  currentSession: SleepSession | null;
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: (quality: number) => void;
  addSession: (session: SleepSession) => void;
  getSessions: (days: number) => SleepSession[];
  getAverageQuality: (days: number) => number;
  loadSessions: () => Promise<void>;
  saveSessions: () => Promise<void>;
}

export const useSleepStore = create<SleepStore>((set, get) => ({
  sessions: [],
  currentSession: null,
  isTracking: false,

  startTracking: () => {
    const now = new Date();
    const session: SleepSession = {
      id: Date.now().toString(),
      date: now.toISOString().split('T')[0],
      startTime: now.toISOString(),
      endTime: '',
      duration: 0,
      quality: 0,
      deepSleep: 0,
      lightSleep: 0,
      awake: 0,
      interruptions: 0
    };
    set({ currentSession: session, isTracking: true });
  },

  stopTracking: (quality) => {
    const { currentSession } = get();
    if (currentSession) {
      const now = new Date();
      const start = new Date(currentSession.startTime);
      const duration = Math.floor((now.getTime() - start.getTime()) / 60000);

      // Simulate sleep stage distribution
      const deepSleep = Math.floor(duration * 0.25);
      const lightSleep = Math.floor(duration * 0.55);
      const awake = duration - deepSleep - lightSleep;

      const completedSession: SleepSession = {
        ...currentSession,
        endTime: now.toISOString(),
        duration,
        quality,
        deepSleep,
        lightSleep,
        awake,
        interruptions: Math.floor(Math.random() * 3)
      };

      set((state) => ({
        sessions: [completedSession, ...state.sessions],
        currentSession: null,
        isTracking: false
      }));
      get().saveSessions();
    }
  },

  addSession: (session) => {
    set((state) => ({
      sessions: [session, ...state.sessions]
    }));
    get().saveSessions();
  },

  getSessions: (days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return get().sessions.filter((session) =>
      new Date(session.date) >= cutoff
    );
  },

  getAverageQuality: (days) => {
    const sessions = get().getSessions(days);
    if (sessions.length === 0) return 0;
    const sum = sessions.reduce((acc, s) => acc + s.quality, 0);
    return Math.round(sum / sessions.length);
  },

  loadSessions: async () => {
    try {
      const stored = await AsyncStorage.getItem('sleepSessions');
      if (stored) {
        set({ sessions: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load sleep sessions:', error);
    }
  },

  saveSessions: async () => {
    try {
      await AsyncStorage.setItem('sleepSessions', JSON.stringify(get().sessions));
    } catch (error) {
      console.error('Failed to save sleep sessions:', error);
    }
  }
}));
