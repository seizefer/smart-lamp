export const colors = {
  // Primary colors
  primary: '#6C5CE7',
  primaryDark: '#5849C7',
  primaryLight: '#A29BFE',

  // Background colors
  background: '#0F0F1E',
  backgroundLight: '#1A1A2E',
  backgroundCard: '#16213E',

  // Surface colors
  surface: '#1E2749',
  surfaceLight: '#2A3563',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#A8A8C4',
  textMuted: '#6B7280',

  // Accent colors
  accent: '#FF6B9D',
  accentSecondary: '#FFA07A',

  // Status colors
  success: '#00D9A3',
  warning: '#FFC107',
  error: '#FF4757',
  info: '#4FC3F7',

  // Light colors (for light mode)
  lightBackground: '#F8F9FA',
  lightSurface: '#FFFFFF',
  lightText: '#1A1A2E',

  // Gradient colors
  gradientStart: '#667EEA',
  gradientEnd: '#764BA2',

  // Light temperature colors
  warmWhite: '#FFE4B5',
  coolWhite: '#E0F0FF',

  // Opacity variants
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)'
};

export const getColorTemperatureColor = (temp: number): string => {
  // Map 2000K-6500K to warm-cool color
  const normalized = (temp - 2000) / (6500 - 2000);

  if (normalized <= 0.5) {
    // Warm colors (2000K - 4250K)
    const factor = normalized * 2;
    return interpolateColor('#FF8C00', '#FFD700', factor);
  } else {
    // Cool colors (4250K - 6500K)
    const factor = (normalized - 0.5) * 2;
    return interpolateColor('#FFD700', '#E0F0FF', factor);
  }
};

function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}
