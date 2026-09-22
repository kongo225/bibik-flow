import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeStore } from '../store/useThemeStore';

export const HomeScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t('home.title')}
      </Text>
      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.accent }]}>
          {t('home.verse_of_the_day')}
        </Text>
        <Text style={[styles.verseText, { color: theme.colors.text }]}>
          "Car Dieu a tant aimé le monde qu'il a donné son Fils unique..."
        </Text>
        <Text style={[styles.verseRef, { color: theme.colors.textMuted }]}>
          Jean 3:16 (LSG)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  verseText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  verseRef: {
    fontSize: 14,
    textAlign: 'right',
  },
});
