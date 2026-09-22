import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { useReadingStore } from '../store/useReadingStore';
import { useThemeStore } from '../store/useThemeStore';
import { useAudioStore } from '../store/useAudioStore';
import { audioService } from '../services/audioService';
import { bibleService } from '../services/bibleService';
import { Book, Verse, Highlight, BibleVersion } from '../data/repositories/bibleRepository';
import { BookPicker } from '../components/BookPicker';
import { ReadingSettingsModal } from '../components/ReadingSettingsModal';
import { VerseActionMenu } from '../components/VerseActionMenu';
import { MiniAudioPlayer } from '../components/MiniAudioPlayer';
import { AudioPlayerModal } from '../components/AudioPlayerModal';
import { ChevronLeft, ChevronRight, SlidersHorizontal, BookOpen, Layers, Volume2 } from 'lucide-react-native';

export const BibleScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { fontSize, lineHeight } = useThemeStore();

  const {
    currentVersionId,
    currentBookId,
    currentChapter,
    setCurrentVersionId,
    setCurrentBookId,
    setCurrentChapter,
    setReadingPosition,
    loadReadingPosition,
  } = useReadingStore();

  const { currentVerseNum, activeBookId, activeChapter } = useAudioStore();

  const [book, setBook] = useState<Book | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);

  // Modals
  const [bookPickerVisible, setBookPickerVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [versionPickerVisible, setVersionPickerVisible] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVerses, setCompareVerses] = useState<Verse[]>([]);

  useEffect(() => {
    loadReadingPosition();
    bibleService.getVersions().then(setVersions);
  }, []);

  useEffect(() => {
    fetchChapterData();
  }, [currentVersionId, currentBookId, currentChapter, i18n.language]);

  const fetchChapterData = async () => {
    const bookData = await bibleService.getBook(currentBookId, i18n.language);
    setBook(bookData);

    const verseData = await bibleService.getChapterVerses(currentVersionId, currentBookId, currentChapter);
    setVerses(verseData);

    const highlightData = await bibleService.getHighlights(currentVersionId, currentBookId, currentChapter);
    setHighlights(highlightData);

    if (compareMode) {
      const altVersionId = currentVersionId === 'lsg' ? 'darby' : 'lsg';
      const altVerseData = await bibleService.getChapterVerses(altVersionId, currentBookId, currentChapter);
      setCompareVerses(altVerseData);
    }
  };

  const handleNextChapter = () => {
    if (book && currentChapter < book.chapters_count) {
      setCurrentChapter(currentChapter + 1);
    } else if (currentBookId < 66) {
      setCurrentBookId(currentBookId + 1);
      setCurrentChapter(1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    } else if (currentBookId > 1) {
      const prevBookId = currentBookId - 1;
      bibleService.getBook(prevBookId, i18n.language).then((b) => {
        if (b) {
          setReadingPosition(currentVersionId, prevBookId, b.chapters_count);
        }
      });
    }
  };

  const handlePlayAudioChapter = () => {
    if (verses.length > 0 && book) {
      audioService.playChapter(verses, book.name, 1, i18n.language);
    }
  };

  const getVerseHighlight = (verseNum: number) => {
    return highlights.find((h) => h.verse === verseNum)?.color;
  };

  const toggleCompareMode = () => {
    const nextCompare = !compareMode;
    setCompareMode(nextCompare);
    if (nextCompare) {
      const altVersionId = currentVersionId === 'lsg' ? 'darby' : 'lsg';
      bibleService.getChapterVerses(altVersionId, currentBookId, currentChapter).then(setCompareVerses);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Header Bar */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.bookSelector} onPress={() => setBookPickerVisible(true)}>
          <BookOpen size={18} color={theme.colors.accent} />
          <Text style={[styles.bookSelectorText, { color: theme.colors.text }]}>
            {book?.name || '...'} {currentChapter}
          </Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handlePlayAudioChapter}>
            <Volume2 size={20} color={theme.colors.accent} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.versionBadge,
              { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border },
            ]}
            onPress={() => setVersionPickerVisible(true)}
          >
            <Text style={[styles.versionBadgeText, { color: theme.colors.accent }]}>
              {currentVersionId.toUpperCase()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={toggleCompareMode}>
            <Layers size={20} color={compareMode ? theme.colors.accent : theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={() => setSettingsVisible(true)}>
            <SlidersHorizontal size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Reader Text Area */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {verses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{ color: theme.colors.textMuted }}>
              Aucun verset disponible pour ce chapitre ({currentVersionId.toUpperCase()}).
            </Text>
          </View>
        ) : (
          verses.map((v) => {
            const highlightColor = getVerseHighlight(v.verse);
            const isSelected = selectedVerse?.verse === v.verse;
            const isAudioActiveVerse =
              activeBookId === currentBookId && activeChapter === currentChapter && currentVerseNum === v.verse;
            const altVerse = compareVerses.find((cv) => cv.verse === v.verse);

            return (
              <TouchableOpacity
                key={v.verse}
                activeOpacity={0.7}
                onPress={() => setSelectedVerse(isSelected ? null : v)}
                style={[
                  styles.verseContainer,
                  highlightColor ? { backgroundColor: highlightColor } : null,
                  isAudioActiveVerse ? { backgroundColor: theme.colors.surfaceVariant, borderLeftWidth: 3, borderLeftColor: theme.colors.accent } : null,
                  isSelected ? { backgroundColor: theme.colors.surfaceVariant, borderRadius: 8 } : null,
                ]}
              >
                <Text
                  style={[
                    styles.verseText,
                    {
                      fontSize,
                      lineHeight: fontSize * lineHeight,
                      color: theme.colors.text,
                    },
                  ]}
                >
                  <Text style={[styles.verseNumber, { color: theme.colors.verseNumber }]}>
                    {v.verse}{' '}
                  </Text>
                  {v.text}
                </Text>

                {/* Compare Mode Alternative Verse */}
                {compareMode && altVerse && (
                  <View style={[styles.compareBox, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.compareLabel, { color: theme.colors.accent }]}>
                      {currentVersionId === 'lsg' ? 'DARBY' : 'LSG'}
                    </Text>
                    <Text style={{ fontSize: fontSize - 2, color: theme.colors.textMuted }}>
                      {altVerse.text}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}

        {/* Chapter Navigation Footer Bar */}
        <View style={styles.navFooter}>
          <TouchableOpacity style={[styles.navBtn, { borderColor: theme.colors.border }]} onPress={handlePrevChapter}>
            <ChevronLeft size={20} color={theme.colors.text} />
            <Text style={{ color: theme.colors.text }}>Précédent</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.navBtn, { borderColor: theme.colors.border }]} onPress={handleNextChapter}>
            <Text style={{ color: theme.colors.text }}>Suivant</Text>
            <ChevronRight size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Mini Audio Player */}
      <MiniAudioPlayer />

      {/* Full Screen Audio Modal */}
      <AudioPlayerModal />

      {/* Book / Chapter Picker Modal */}
      <BookPicker
        visible={bookPickerVisible}
        language={i18n.language}
        onClose={() => setBookPickerVisible(false)}
        onSelect={(bId, ch) => {
          setReadingPosition(currentVersionId, bId, ch);
        }}
      />

      {/* Settings Modal */}
      <ReadingSettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />

      {/* Version Selector Modal */}
      <Modal visible={versionPickerVisible} transparent animationType="fade" onRequestClose={() => setVersionPickerVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setVersionPickerVisible(false)}>
          <View style={[styles.versionModal, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Choisir une version</Text>
            {versions.map((ver) => (
              <TouchableOpacity
                key={ver.id}
                style={[
                  styles.versionItem,
                  { borderBottomColor: theme.colors.border },
                  currentVersionId === ver.id && { backgroundColor: theme.colors.surfaceVariant },
                ]}
                onPress={() => {
                  setCurrentVersionId(ver.id);
                  setVersionPickerVisible(false);
                }}
              >
                <View>
                  <Text style={[styles.versionName, { color: theme.colors.text }]}>{ver.name}</Text>
                  <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>{ver.license}</Text>
                </View>
                <Text style={{ fontWeight: 'bold', color: theme.colors.accent }}>{ver.abbreviation}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Verse Contextual Actions Menu */}
      <VerseActionMenu
        verse={selectedVerse}
        bookName={book?.name || ''}
        onClose={() => setSelectedVerse(null)}
        onRefresh={fetchChapterData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  bookSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookSelectorText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  versionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  versionBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  verseContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginVertical: 2,
  },
  verseText: {
    textAlign: 'left',
  },
  verseNumber: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  compareBox: {
    marginTop: 6,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  compareLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  navFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 16,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  versionModal: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  versionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  versionName: {
    fontSize: 15,
    fontWeight: '500',
  },
});
