import React, { createContext, useContext, useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { getThemeTokens, ThemeTokens } from './tokens';

const ThemeContext = createContext<ThemeTokens>(getThemeTokens('light'));

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { themeMode, accentColor, loadSettings } = useThemeStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const themeTokens = getThemeTokens(themeMode, accentColor);

  return (
    <ThemeContext.Provider value={themeTokens}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeTokens => useContext(ThemeContext);
