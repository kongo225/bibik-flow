import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { studyService, DictionaryEntry, TimelineEvent } from '../services/studyService';
import { readingPlanService, ReadingPlan, ReadingPlanDay } from '../services/readingPlanService';
import { bibleService } from '../services/bibleService';
import { useReadingStore } from '../store/useReadingStore';
import { useRouter } from 'expo-router';
import { Calendar, CheckCircle2, Circle, BookOpen, Search, BookMarked, Clock } from 'lucide-react-native';

export const StudyScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { setReadingPosition, currentVersionId } = useReadingStore();

  const [activeTab, setActiveTab] = useState<'plans' | 'dictionary' | 'timelines'>('plans');

  // Plans State
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlan | null>(null);
  const [planDays, setPlanDays] = useState<ReadingPlanDay[]>([]);
  const [bookNamesMap, setBookNamesMap] = useState<Record<number, string>>({});

  // Dictionary State
  const [dictQuery, setDictQuery] = useState('');
  const [dictEntries, setDictEntries] = useState<DictionaryEntry[]>([]);

  // Timelines State
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    bibleService.getBooks(i18n.language).then((books) => {
      const map: Record<number, string> = {};
      books.forEach((b) => {
        map[b.id] = b.name;
      });
      setBookNamesMap(map);
    });

    readingPlanService.getPlans().then((data) => {
      setPlans(data);
      if (data.length > 0 && !selectedPlan) {
        setSelectedPlan(data[0]);
      }
    });

    studyService.getDictionaryEntries().then(setDictEntries);
    studyService.getTimelineEvents().then(setTimelineEvents);
  }, [i18n.language]);

  useEffect(() => {
    if (selectedPlan) {
      readingPlanService.getPlanDays(selectedPlan.id).then(setPlanDays);
    }
  }, [selectedPlan]);

  const handleSearchDict = (query: string) => {
    setDictQuery(query);
    studyService.getDictionaryEntries(query).then(setDictEntries);
  };

  const handleToggleDay = async (dayNum: number, currentCompleted: boolean) => {
    if (!selectedPlan) return;
    await readingPlanService.markDayCompleted(selectedPlan.id, dayNum, !currentCompleted);
    const updated = await readingPlanService.getPlanDays(selectedPlan.id);
    setPlanDays(updated);
  };

  const handleOpenReading = (bookId: number, chapter: number) => {
    setReadingPosition(currentVersionId, bookId, chapter, 1);
    router.push('/(tabs)/bible');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('study.title')}</Text>
      </View>

      {/* Main Study Sub-Tabs Bar */}
      <View style={[styles.tabsBar, { backgroundColor: theme.colors.surfaceVariant }]}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'plans' && { backgroundColor: theme.colors.accent, borderRadius: 16 }]}
          onPress={() => setActiveTab('plans')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'plans' ? theme.colors.accentText : theme.colors.textMuted }]}>
            Plans
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'dictionary' && { backgroundColor: theme.colors.accent, borderRadius: 16 }]}
          onPress={() => setActiveTab('dictionary')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'dictionary' ? theme.colors.accentText : theme.colors.textMuted }]}>
            Dictionnaire
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'timelines' && { backgroundColor: theme.colors.accent, borderRadius: 16 }]}
          onPress={() => setActiveTab('timelines')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'timelines' ? theme.colors.accentText : theme.colors.textMuted }]}>
            Chronologie
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* TAB 1: READING PLANS */}
        {activeTab === 'plans' && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('study.reading_plans')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.plansRow}>
              {plans.map((p) => {
                const isSelected = selectedPlan?.id === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.planCard,
                      {
                        backgroundColor: isSelected ? theme.colors.surfaceVariant : theme.colors.surface,
                        borderColor: isSelected ? theme.colors.accent : theme.colors.border,
                      },
                    ]}
                    onPress={() => setSelectedPlan(p)}
                  >
                    <Calendar size={20} color={isSelected ? theme.colors.accent : theme.colors.textMuted} />
                    <Text style={[styles.planCardTitle, { color: theme.colors.text }]}>{p.title}</Text>
                    <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>{p.duration_days} jours</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {selectedPlan && (
              <View style={styles.planDetailSection}>
                <Text style={[styles.selectedTitle, { color: theme.colors.text }]}>{selectedPlan.title}</Text>
                <Text style={[styles.selectedDesc, { color: theme.colors.textMuted }]}>{selectedPlan.description}</Text>

                <View style={styles.daysList}>
                  {planDays.map((d) => (
                    <View key={d.day} style={[styles.dayCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                      <View style={styles.dayHeader}>
                        <TouchableOpacity style={styles.checkBtn} onPress={() => handleToggleDay(d.day, !!d.completed)}>
                          {d.completed ? <CheckCircle2 size={22} color={theme.colors.accent} /> : <Circle size={22} color={theme.colors.textMuted} />}
                          <Text style={[styles.dayNumber, { color: d.completed ? theme.colors.accent : theme.colors.text }]}>
                            Jour {d.day}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.passagesRow}>
                        {d.readings.map((reading, idx) => (
                          <TouchableOpacity
                            key={idx}
                            style={[styles.passageChip, { backgroundColor: theme.colors.surfaceVariant }]}
                            onPress={() => handleOpenReading(reading.book_id, reading.chapter)}
                          >
                            <BookOpen size={14} color={theme.colors.accent} />
                            <Text style={[styles.passageText, { color: theme.colors.text }]}>
                              {bookNamesMap[reading.book_id] || `Livre #${reading.book_id}`} {reading.chapter}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* TAB 2: DICTIONARY / LEXICON */}
        {activeTab === 'dictionary' && (
          <View style={{ gap: 12 }}>
            <View style={[styles.searchBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Search size={18} color={theme.colors.textMuted} />
              <TextInput
                style={[styles.searchInput, { color: theme.colors.text }]}
                placeholder="Rechercher un mot (ex: Alliance, Grâce)..."
                placeholderTextColor={theme.colors.textMuted}
                value={dictQuery}
                onChangeText={handleSearchDict}
              />
            </View>

            {dictEntries.map((entry) => (
              <View key={entry.id} style={[styles.dictCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.dictCardHeader}>
                  <Text style={[styles.termTitle, { color: theme.colors.accent }]}>{entry.term}</Text>
                  <Text style={[styles.categoryBadge, { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.textMuted }]}>
                    {entry.category}
                  </Text>
                </View>
                <Text style={[styles.dictDef, { color: theme.colors.text }]}>{entry.definition}</Text>
                <Text style={[styles.dictRefs, { color: theme.colors.textMuted }]}>
                  Références : {entry.related_refs}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: TIMELINES */}
        {activeTab === 'timelines' && (
          <View style={{ gap: 12 }}>
            {timelineEvents.map((event) => (
              <View key={event.id} style={[styles.timelineCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.timelineHeader}>
                  <Text style={[styles.timelineTitle, { color: theme.colors.text }]}>{event.title}</Text>
                  <Text style={[styles.dateBadge, { color: theme.colors.accent }]}>{event.date_label}</Text>
                </View>
                <Text style={[styles.timelineDesc, { color: theme.colors.textMuted }]}>{event.description}</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: theme.colors.accent }}>
                  Versets : {event.refs}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 52, justifyContent: 'center', paddingHorizontal: 16, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: 'bold' },
  tabsBar: { flexDirection: 'row', padding: 4, margin: 12, borderRadius: 20 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  tabText: { fontWeight: '600', fontSize: 13 },
  content: { padding: 16, gap: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  plansRow: { gap: 12, paddingRight: 16 },
  planCard: { width: 140, padding: 12, borderRadius: 12, borderWidth: 1, gap: 6 },
  planCardTitle: { fontSize: 14, fontWeight: 'bold' },
  planDetailSection: { marginTop: 12, gap: 8 },
  selectedTitle: { fontSize: 18, fontWeight: 'bold' },
  selectedDesc: { fontSize: 14, lineHeight: 20 },
  daysList: { marginTop: 12, gap: 10 },
  dayCard: { padding: 12, borderRadius: 12, borderWidth: 1, gap: 8 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checkBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dayNumber: { fontSize: 15, fontWeight: 'bold' },
  passagesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  passageChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  passageText: { fontSize: 12, fontWeight: '500' },
  searchBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 44, borderRadius: 22, borderWidth: 1, gap: 8 },
  searchInput: { flex: 1, fontSize: 14 },
  dictCard: { padding: 12, borderRadius: 12, borderWidth: 1, gap: 6 },
  dictCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  termTitle: { fontSize: 16, fontWeight: 'bold' },
  categoryBadge: { fontSize: 10, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, overflow: 'hidden' },
  dictDef: { fontSize: 14, lineHeight: 20 },
  dictRefs: { fontSize: 12, fontStyle: 'italic' },
  timelineCard: { padding: 12, borderRadius: 12, borderWidth: 1, gap: 6, borderLeftWidth: 4, borderLeftColor: '#2563EB' },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timelineTitle: { fontSize: 15, fontWeight: 'bold' },
  dateBadge: { fontSize: 12, fontWeight: 'bold' },
  timelineDesc: { fontSize: 13, lineHeight: 18 },
});
