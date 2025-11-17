import { create } from 'zustand';
import { LightScene } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LightStore {
  isOn: boolean;
  brightness: number;
  colorTemperature: number;
  currentScene: LightScene | null;
  scenes: LightScene[];
  toggleLight: () => void;
  setBrightness: (value: number) => void;
  setColorTemperature: (value: number) => void;
  applyScene: (scene: LightScene) => void;
  addScene: (scene: LightScene) => void;
  deleteScene: (id: string) => void;
  loadState: () => Promise<void>;
  saveState: () => Promise<void>;
}

const defaultScenes: LightScene[] = [
  {
    id: 'sunrise',
    name: '日出',
    brightness: 30,
    colorTemperature: 2700,
    duration: 300,
    isCustom: false
  },
  {
    id: 'daylight',
    name: '日光',
    brightness: 100,
    colorTemperature: 5500,
    isCustom: false
  },
  {
    id: 'sunset',
    name: '日落',
    brightness: 40,
    colorTemperature: 2200,
    duration: 300,
    isCustom: false
  },
  {
    id: 'night',
    name: '夜灯',
    brightness: 5,
    colorTemperature: 2000,
    isCustom: false
  },
  {
    id: 'reading',
    name: '阅读',
    brightness: 80,
    colorTemperature: 4000,
    isCustom: false
  },
  {
    id: 'relax',
    name: '放松',
    brightness: 20,
    colorTemperature: 2500,
    isCustom: false
  }
];

export const useLightStore = create<LightStore>((set, get) => ({
  isOn: false,
  brightness: 50,
  colorTemperature: 4000,
  currentScene: null,
  scenes: defaultScenes,

  toggleLight: () => {
    set((state) => ({ isOn: !state.isOn }));
    get().saveState();
  },

  setBrightness: (value) => {
    set({ brightness: value, currentScene: null });
    get().saveState();
  },

  setColorTemperature: (value) => {
    set({ colorTemperature: value, currentScene: null });
    get().saveState();
  },

  applyScene: (scene) => {
    set({
      currentScene: scene,
      brightness: scene.brightness,
      colorTemperature: scene.colorTemperature,
      isOn: true
    });
    get().saveState();
  },

  addScene: (scene) => {
    set((state) => ({
      scenes: [...state.scenes, scene]
    }));
    get().saveState();
  },

  deleteScene: (id) => {
    set((state) => ({
      scenes: state.scenes.filter((scene) => scene.id !== id && !scene.isCustom)
    }));
    get().saveState();
  },

  loadState: async () => {
    try {
      const stored = await AsyncStorage.getItem('lightState');
      if (stored) {
        const state = JSON.parse(stored);
        set(state);
      }
    } catch (error) {
      console.error('Failed to load light state:', error);
    }
  },

  saveState: async () => {
    try {
      const { isOn, brightness, colorTemperature, currentScene, scenes } = get();
      await AsyncStorage.setItem('lightState', JSON.stringify({
        isOn,
        brightness,
        colorTemperature,
        currentScene,
        scenes
      }));
    } catch (error) {
      console.error('Failed to save light state:', error);
    }
  }
}));
