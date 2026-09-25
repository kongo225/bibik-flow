import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useReadingStore } from '../store/useReadingStore';
import { bibleService } from '../services/bibleService';
import { Verse, Book } from '../data/repositories/bibleRepository';
import { useTranslation } from 'react-i18next';

export const VersionCompareScreen = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const { currentBookId, currentChapter } = useReadingStore();

  const [book, setBook] = useState<Book | null>(null);
  const [lsgVerses, setLsgVerses] = useState<Verse[]>([]);
  const [darbyVerses, setDarbyVerses] = useState<Verse[]>([]);

  useEffect(() => {
    bibleService.getBook(currentBookId, i18n.language).then(setBook);
    bibleService.getChapterVerses('lsg', currentBookId, currentChapter).then(setLsgVerses);
    bibleService.getChapterVerses('darby', currentBookId, currentChapter).then(setDarbyVerses);
  }, [currentBookId, currentChapter, i18n.language]);

  const maxVerses = Math.max(lsgVerses.length, darbyVerses.length);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Comparaison : {book?.name} {currentChapter}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {Array.from({ length: maxVerses }, (_, i) => i + 1).map((verseNum) => {
          const lsg = lsgVerses.find((v) => v.verse === verseNum);
          const darby = darbyVerses.find((v) => v.verse === verseNum);

          return (
            <View
              key={verseNum}
              style={[styles.verseBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <Text style={[styles.verseNum, { color: theme.colors.accent }]}>Verset {verseNum}</Text>

              <View style={styles.col}>
                <Text style={[styles.versionTag, { color: theme.colors.accent }]}>LSG 1910</Text>
                <Text style={[styles.text, { color: theme.colors.text }]}>
                  {lsg?.text || '(Non disponible)'}
                </Text>
              </View>

              <View style={[styles.col, { marginTop: 8 }]}>
                <Text style={[styles.versionTag, { color: theme.colors.textMuted }]}>DARBY</Text>
                <Text style={[styles.text, { color: theme.colors.text }]}>
                  {darby?.text || '(Non disponible)'}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  verseBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  verseNum: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  col: {
    marginVertical: 2,
  },
  versionTag: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
});
