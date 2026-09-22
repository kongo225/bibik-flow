import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { verseOfDayService, VerseOfDayResult } from '../services/verseOfDayService';
import { readingPlanService } from '../services/readingPlanService';
import { useReadingStore } from '../store/useReadingStore';
import { useRouter } from 'expo-router';
import { BookOpen, Calendar, Share2, ArrowRight, Flame } from 'lucide-react-native';

export const HomeScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { currentBookId, currentChapter, currentVersionId, setReadingPosition } = useReadingStore();

  const [vod, setVod] = useState<VerseOfDayResult | null>(null);
  const [activePlanProgress, setActivePlanProgress] = useState<{ completedCount: number; totalDays: number; percent: number } | null>(null);

  useEffect(() => {
    verseOfDayService.getTodayVerse(currentVersionId, i18n.language).then(setVod);
    readingPlanService.getActivePlanProgress('plan_1_year').then(setActivePlanProgress);
  }, [currentVersionId, i18n.language]);

  const handleShareVod = () => {
    if (vod) {
      Share.share({
        message: `"${vod.verse.text}" — ${vod.book_name} ${vod.verse.chapter}:${vod.verse.verse}`,
      });
    }
  };

  const handleOpenVerse = () => {
    if (vod) {
      setReadingPosition(currentVersionId, vod.verse.book_id, vod.verse.chapter, vod.verse.verse);
      router.push('/(tabs)/bible');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.colors.text }]}>Bonjour 👋</Text>
        <Text style={[styles.subGreeting, { color: theme.colors.textMuted }]}>
          Poursuivez votre lecture quotidienne de la Bible.
        </Text>
      </View>

      {/* Verse of the Day Card */}
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardBadge, { color: theme.colors.accent }]}>
            {t('home.verse_of_the_day')}
          </Text>
          <TouchableOpacity onPress={handleShareVod}>
            <Share2 size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleOpenVerse} activeOpacity={0.8}>
          <Text style={[styles.verseText, { color: theme.colors.text }]}>
            "{vod ? vod.verse.text : "Car Dieu a tant aimé le monde..."}"
          </Text>
          <Text style={[styles.verseRef, { color: theme.colors.accent }]}>
            {vod ? `${vod.book_name} ${vod.verse.chapter}:${vod.verse.verse}` : 'Jean 3:16'} ({currentVersionId.toUpperCase()})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Continue Reading Card */}
      <TouchableOpacity
        style={[styles.card, styles.continueCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        onPress={() => router.push('/(tabs)/bible')}
      >
        <View style={styles.continueLeft}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.surfaceVariant }]}>
            <BookOpen size={20} color={theme.colors.accent} />
          </View>
          <View>
            <Text style={[styles.continueTitle, { color: theme.colors.text }]}>
              {t('home.continue_reading')}
            </Text>
            <Text style={[styles.continueSub, { color: theme.colors.textMuted }]}>
              Dernière position de lecture
            </Text>
          </View>
        </View>
        <ArrowRight size={20} color={theme.colors.textMuted} />
      </TouchableOpacity>

      {/* Active Reading Plan Card */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        onPress={() => router.push('/(tabs)/study')}
      >
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Calendar size={18} color={theme.colors.accent} />
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              {t('home.daily_plan')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Flame size={18} color="#F59E0B" />
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#F59E0B' }}>
              Série : 1 jour
            </Text>
          </View>
        </View>

        <Text style={[styles.planName, { color: theme.colors.text }]}>Bible en 1 an</Text>
        <Text style={[styles.planProgressText, { color: theme.colors.textMuted }]}>
          {activePlanProgress?.completedCount || 0} / {activePlanProgress?.totalDays || 365} jours accomplis ({activePlanProgress?.percent || 0}%)
        </Text>

        {/* Progress Bar */}
        <View style={[styles.progressBarBg, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View
            style={[
              styles.progressBarFill,
              { backgroundColor: theme.colors.accent, width: `${Math.max(5, activePlanProgress?.percent || 0)}%` },
            ]}
          />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },
  header: { marginTop: 8 },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  subGreeting: { fontSize: 14, marginTop: 4 },
  card: { padding: 16, borderRadius: 16, borderWidth: 1, gap: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBadge: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  verseText: { fontSize: 16, fontStyle: 'italic', lineHeight: 24 },
  verseRef: { fontSize: 14, fontWeight: 'bold', textAlign: 'right' },
  continueCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  continueLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  continueTitle: { fontSize: 15, fontWeight: 'bold' },
  continueSub: { fontSize: 12 },
  planName: { fontSize: 15, fontWeight: '600' },
  planProgressText: { fontSize: 13 },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
});
