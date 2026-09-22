import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { readingPlanService, ReadingPlan, ReadingPlanDay } from '../services/readingPlanService';
import { bibleService } from '../services/bibleService';
import { useReadingStore } from '../store/useReadingStore';
import { useRouter } from 'expo-router';
import { Calendar, CheckCircle2, Circle, BookOpen } from 'lucide-react-native';

export const StudyScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { setReadingPosition, currentVersionId } = useReadingStore();

  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlan | null>(null);
  const [planDays, setPlanDays] = useState<ReadingPlanDay[]>([]);
  const [bookNamesMap, setBookNamesMap] = useState<Record<number, string>>({});

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
  }, [i18n.language]);

  useEffect(() => {
    if (selectedPlan) {
      readingPlanService.getPlanDays(selectedPlan.id).then(setPlanDays);
    }
  }, [selectedPlan]);

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
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('study.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Plans Selector Cards */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('study.reading_plans')}
        </Text>

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

        {/* Selected Plan Details & Days List */}
        {selectedPlan && (
          <View style={styles.planDetailSection}>
            <Text style={[styles.selectedTitle, { color: theme.colors.text }]}>{selectedPlan.title}</Text>
            <Text style={[styles.selectedDesc, { color: theme.colors.textMuted }]}>{selectedPlan.description}</Text>

            <View style={styles.daysList}>
              {planDays.map((d) => (
                <View
                  key={d.day}
                  style={[styles.dayCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                >
                  <View style={styles.dayHeader}>
                    <TouchableOpacity
                      style={styles.checkBtn}
                      onPress={() => handleToggleDay(d.day, !!d.completed)}
                    >
                      {d.completed ? (
                        <CheckCircle2 size={22} color={theme.colors.accent} />
                      ) : (
                        <Circle size={22} color={theme.colors.textMuted} />
                      )}
                      <Text
                        style={[
                          styles.dayNumber,
                          {
                            color: d.completed ? theme.colors.accent : theme.colors.text,
                            textDecorationLine: d.completed ? 'line-through' : 'none',
                          },
                        ]}
                      >
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 52, justifyContent: 'center', paddingHorizontal: 16, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: 'bold' },
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
});
