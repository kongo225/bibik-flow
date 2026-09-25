import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, DEFAULT_ACCENT } from '../theme/tokens';

interface ThemeState {
  themeMode: ThemeMode;
  accentColor: string;
  fontSize: number;
  lineHeight: number;
  setThemeMode: (mode: ThemeMode) => void;
  setAccentColor: (color: string) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  loadSettings: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeMode: 'light',
  accentColor: DEFAULT_ACCENT,
  fontSize: 18,
  lineHeight: 1.5,

  setThemeMode: (mode: ThemeMode) => {
    set({ themeMode: mode });
    AsyncStorage.setItem('app_theme_mode', mode);
  },

  setAccentColor: (color: string) => {
    set({ accentColor: color });
    AsyncStorage.setItem('app_accent_color', color);
  },

  setFontSize: (size: number) => {
    set({ fontSize: size });
    AsyncStorage.setItem('app_font_size', size.toString());
  },

  setLineHeight: (height: number) => {
    set({ lineHeight: height });
    AsyncStorage.setItem('app_line_height', height.toString());
  },

  loadSettings: async () => {
    try {
      const mode = (await AsyncStorage.getItem('app_theme_mode')) as ThemeMode;
      const accent = await AsyncStorage.getItem('app_accent_color');
      const font = await AsyncStorage.getItem('app_font_size');
      const line = await AsyncStorage.getItem('app_line_height');

      set({
        themeMode: mode || 'light',
        accentColor: accent || DEFAULT_ACCENT,
        fontSize: font ? parseInt(font, 10) : 18,
        lineHeight: line ? parseFloat(line) : 1.5,
      });
    } catch (e) {
      console.error('Failed to load theme settings from storage', e);
    }
  },
}));
