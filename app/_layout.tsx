import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';
import '../src/i18n';
import { initDatabase } from '../src/data/database';

function RootLayoutNav() {
  const theme = useTheme();

  useEffect(() => {
    initDatabase().catch((err) => {
      console.error('Failed to initialize database', err);
    });
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
