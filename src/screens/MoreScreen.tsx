import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeStore } from '../store/useThemeStore';
import { useRouter } from 'expo-router';
import { BookOpen, Palette, Globe, Download, Info, ChevronRight } from 'lucide-react-native';

export const MoreScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { themeMode, setThemeMode, accentColor, setAccentColor } = useThemeStore();

  const themes: ('light' | 'dark' | 'sepia' | 'amoled')[] = ['light', 'dark', 'sepia', 'amoled'];
  const accents = ['#2563EB', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#D97706'];

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{t('more.title')}</Text>

      {/* Downloads Manager Link */}
      <TouchableOpacity
        style={[styles.menuCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        onPress={() => router.push('/downloads')}
      >
        <View style={styles.menuLeft}>
          <Download size={20} color={theme.colors.accent} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>Téléchargements & Versions</Text>
        </View>
        <ChevronRight size={18} color={theme.colors.textMuted} />
      </TouchableOpacity>

      {/* Language Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.menuLeft}>
          <Globe size={20} color={theme.colors.accent} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('more.language')}</Text>
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.accent, marginTop: 8 }]} onPress={toggleLanguage}>
          <Text style={{ color: theme.colors.accentText, fontWeight: '600' }}>
            {i18n.language === 'fr' ? t('language.french') : t('language.english')} (Basculer)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Theme Mode Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.menuLeft}>
          <Palette size={20} color={theme.colors.accent} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('more.appearance')}</Text>
        </View>
        <View style={[styles.row, { marginTop: 8 }]}>
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
              <Text style={{ color: theme.colors.text, fontSize: 12 }}>{t(`theme.${m}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Accent Color Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Couleur d'accentuation</Text>
        <View style={[styles.row, { marginTop: 8 }]}>
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

      {/* About & Licenses Link */}
      <TouchableOpacity
        style={[styles.menuCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        onPress={() => router.push('/about')}
      >
        <View style={styles.menuLeft}>
          <Info size={20} color={theme.colors.accent} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>À propos & Licences</Text>
        </View>
        <ChevronRight size={18} color={theme.colors.textMuted} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 14 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  menuCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuText: { fontSize: 15, fontWeight: 'bold' },
  section: { padding: 14, borderRadius: 12, borderWidth: 1, gap: 6 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold' },
  button: { padding: 10, borderRadius: 8, alignItems: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, borderWidth: 1 },
  colorDot: { width: 36, height: 36, borderRadius: 18 },
});
