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

export const DEFAULT_ACCENT = '#168BFF'; // Bleu vibrant de la charte

export const THEME_PALETTES: Record<ThemeMode, Omit<ThemeTokens['colors'], 'accent' | 'accentText'>> = {
  light: {
    background: '#F8FAFF', // Fond clair selon la charte
    surface: '#FFFFFF', // Surface blanche selon la charte
    surfaceVariant: '#EBF3FF',
    text: '#062B8F', // Bleu profond pour le texte principal
    textMuted: '#5272B6',
    border: '#D2E3FC',
    verseNumber: '#168BFF',
    highlight: '#FFB800', // Jaune/Or de la charte pour les surlignages
    card: '#FFFFFF',
  },
  dark: {
    background: '#04174D', // Variante sombre basée sur le bleu profond #062B8F
    surface: '#062B8F',
    surfaceVariant: '#0D3FB1',
    text: '#F8FAFF',
    textMuted: '#9EBFFA',
    border: '#1540A8',
    verseNumber: '#FFB800',
    highlight: '#D99B00',
    card: '#062B8F',
  },
  sepia: {
    background: '#FBF0D9',
    surface: '#F4E8C1',
    surfaceVariant: '#EADBB0',
    text: '#4A3B32',
    textMuted: '#8C7A6B',
    border: '#E2D3B2',
    verseNumber: '#A08E7D',
    highlight: '#FFB800',
    card: '#F4E8C1',
  },
  amoled: {
    background: '#000000',
    surface: '#0A0A0A',
    surfaceVariant: '#141414',
    text: '#FFFFFF',
    textMuted: '#A0A0A0',
    border: '#222222',
    verseNumber: '#FFB800',
    highlight: '#D99B00',
    card: '#0A0A0A',
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
