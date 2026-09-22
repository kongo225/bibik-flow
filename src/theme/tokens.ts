export type ThemeMode = 'light' | 'dark' | 'sepia' | 'amoled';

export interface ThemeTokens {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    surfaceVariant: string;
    text: string;
    textMuted: string;
    accent: string;
    accentText: string;
    border: string;
    verseNumber: string;
    highlight: string;
    card: string;
  };
  typography: {
    fontFamily: {
      sans: string;
      serif: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
  };
}

export const DEFAULT_ACCENT = '#2563EB'; // Royal Blue

export const THEME_PALETTES: Record<ThemeMode, Omit<ThemeTokens['colors'], 'accent' | 'accentText'>> = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    text: '#0F172A',
    textMuted: '#64748B',
    border: '#E2E8F0',
    verseNumber: '#94A3B8',
    highlight: '#FEF08A',
    card: '#FFFFFF',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceVariant: '#334155',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    border: '#334155',
    verseNumber: '#64748B',
    highlight: '#854D0E',
    card: '#1E293B',
  },
  sepia: {
    background: '#FBF0D9',
    surface: '#F4E8C1',
    surfaceVariant: '#EADBB0',
    text: '#4A3B32',
    textMuted: '#8C7A6B',
    border: '#E2D3B2',
    verseNumber: '#A08E7D',
    highlight: '#FDE68A',
    card: '#F4E8C1',
  },
  amoled: {
    background: '#000000',
    surface: '#121212',
    surfaceVariant: '#1E1E1E',
    text: '#FFFFFF',
    textMuted: '#A0A0A0',
    border: '#2A2A2A',
    verseNumber: '#666666',
    highlight: '#854D0E',
    card: '#121212',
  },
};

export const getThemeTokens = (mode: ThemeMode, customAccent = DEFAULT_ACCENT): ThemeTokens => {
  const palette = THEME_PALETTES[mode] || THEME_PALETTES.light;
  return {
    mode,
    colors: {
      ...palette,
      accent: customAccent,
      accentText: '#FFFFFF',
    },
    typography: {
      fontFamily: {
        sans: 'System',
        serif: 'Georgia',
      },
      fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 22,
        xxl: 26,
      },
    },
  };
};
