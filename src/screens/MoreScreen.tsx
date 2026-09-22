import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeStore } from '../store/useThemeStore';
import { ThemeMode } from '../theme/tokens';

export const MoreScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { themeMode, setThemeMode, accentColor, setAccentColor } = useThemeStore();

  const themes: ThemeMode[] = ['light', 'dark', 'sepia', 'amoled'];
  const accents = ['#2563EB', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#D97706'];

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t('more.title')}
      </Text>

      {/* Language Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('more.language')}
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.accent }]}
          onPress={toggleLanguage}
        >
          <Text style={{ color: theme.colors.accentText, fontWeight: '600' }}>
            {i18n.language === 'fr' ? t('language.french') : t('language.english')} (Changer)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Theme Mode Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('more.appearance')}
        </Text>
        <View style={styles.row}>
          {themes.map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.chip,
                {
                  borderColor: themeMode === m ? theme.colors.accent : theme.colors.border,
                  backgroundColor: themeMode === m ? theme.colors.surfaceVariant : theme.colors.surface,
                },
              ]}
              onPress={() => setThemeMode(m)}
            >
              <Text style={{ color: theme.colors.text, fontSize: 12 }}>
                {t(`theme.${m}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Accent Color Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Couleur d'accent
        </Text>
        <View style={styles.row}>
          {accents.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorDot,
                {
                  backgroundColor: color,
                  borderWidth: accentColor === color ? 3 : 0,
                  borderColor: theme.colors.text,
                },
              ]}
              onPress={() => setAccentColor(color)}
            />
          ))}
        </View>
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
  section: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
