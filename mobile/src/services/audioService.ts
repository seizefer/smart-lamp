import { Audio, AVPlaybackStatus } from 'expo-av';
import { SoundTrack } from '../types';

export class AudioService {
  private static soundObject: Audio.Sound | null = null;
  private static isPlaying: boolean = false;

  static async initialize(): Promise<void> {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false
    });
  }

  static async loadSound(uri: string): Promise<void> {
    try {
      // Unload previous sound
      if (this.soundObject) {
        await this.unloadSound();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false, isLooping: true }
      );

      this.soundObject = sound;
      console.log('Sound loaded successfully');
    } catch (error) {
      console.error('Error loading sound:', error);
      throw error;
    }
  }

  static async playSound(): Promise<void> {
    if (!this.soundObject) {
      console.warn('No sound loaded');
      return;
    }

    try {
      await this.soundObject.playAsync();
      this.isPlaying = true;
      console.log('Sound playing');
    } catch (error) {
      console.error('Error playing sound:', error);
      throw error;
    }
  }

  static async pauseSound(): Promise<void> {
    if (!this.soundObject) {
      console.warn('No sound loaded');
      return;
    }

    try {
      await this.soundObject.pauseAsync();
      this.isPlaying = false;
      console.log('Sound paused');
    } catch (error) {
      console.error('Error pausing sound:', error);
      throw error;
    }
  }

  static async stopSound(): Promise<void> {
    if (!this.soundObject) {
      return;
    }

    try {
      await this.soundObject.stopAsync();
      this.isPlaying = false;
      console.log('Sound stopped');
    } catch (error) {
      console.error('Error stopping sound:', error);
      throw error;
    }
  }

  static async setVolume(volume: number): Promise<void> {
    if (!this.soundObject) {
      console.warn('No sound loaded');
      return;
    }

    try {
      // Volume should be between 0.0 and 1.0
      const normalizedVolume = Math.max(0, Math.min(1, volume));
      await this.soundObject.setVolumeAsync(normalizedVolume);
      console.log(`Volume set to ${normalizedVolume}`);
    } catch (error) {
      console.error('Error setting volume:', error);
      throw error;
    }
  }

  static async fadeIn(duration: number = 3000): Promise<void> {
    if (!this.soundObject) {
      console.warn('No sound loaded');
      return;
    }

    const steps = 20;
    const stepDuration = duration / steps;
    const volumeIncrement = 1 / steps;

    await this.setVolume(0);
    await this.playSound();

    for (let i = 0; i <= steps; i++) {
      await this.setVolume(i * volumeIncrement);
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }
  }

  static async fadeOut(duration: number = 3000): Promise<void> {
    if (!this.soundObject) {
      console.warn('No sound loaded');
      return;
    }

    const status = await this.soundObject.getStatusAsync();
    if (!status.isLoaded) {
      return;
    }

    const currentVolume = status.volume || 1;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeDecrement = currentVolume / steps;

    for (let i = steps; i >= 0; i--) {
      await this.setVolume(i * volumeDecrement);
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }

    await this.stopSound();
  }

  static async unloadSound(): Promise<void> {
    if (!this.soundObject) {
      return;
    }

    try {
      await this.soundObject.unloadAsync();
      this.soundObject = null;
      this.isPlaying = false;
      console.log('Sound unloaded');
    } catch (error) {
      console.error('Error unloading sound:', error);
      throw error;
    }
  }

  static getIsPlaying(): boolean {
    return this.isPlaying;
  }

  static async getStatus(): Promise<AVPlaybackStatus | null> {
    if (!this.soundObject) {
      return null;
    }

    return await this.soundObject.getStatusAsync();
  }
}

// Predefined sound tracks
export const soundTracks: SoundTrack[] = [
  {
    id: 'white-noise',
    name: '白噪音',
    type: 'white-noise',
    file: 'https://example.com/sounds/white-noise.mp3'
  },
  {
    id: 'rain',
    name: '雨声',
    type: 'nature',
    file: 'https://example.com/sounds/rain.mp3'
  },
  {
    id: 'ocean',
    name: '海浪',
    type: 'nature',
    file: 'https://example.com/sounds/ocean.mp3'
  },
  {
    id: 'forest',
    name: '森林',
    type: 'nature',
    file: 'https://example.com/sounds/forest.mp3'
  },
  {
    id: 'ambient-1',
    name: '环境音乐 1',
    type: 'ambient',
    file: 'https://example.com/sounds/ambient-1.mp3'
  },
  {
    id: 'ambient-2',
    name: '环境音乐 2',
    type: 'ambient',
    file: 'https://example.com/sounds/ambient-2.mp3'
  }
];
