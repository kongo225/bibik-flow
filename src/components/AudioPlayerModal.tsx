import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useAudioStore } from '../store/useAudioStore';
import { audioService } from '../services/audioService';
import { Play, Pause, SkipBack, SkipForward, X, Moon } from 'lucide-react-native';

export const AudioPlayerModal = () => {
  const theme = useTheme();
  const {
    playerModalVisible,
    setPlayerModalVisible,
    isPlaying,
    isPaused,
    bookName,
    activeChapter,
    currentVerseNum,
    playbackRate,
    sleepTimerMinutes,
  } = useAudioStore();

  if (!playerModalVisible) return null;

  const handlePlayPause = () => {
    if (isPaused) {
      audioService.resume();
    } else {
      audioService.pause();
    }
  };

  const rates = [0.75, 1.0, 1.25, 1.5, 2.0];
  const sleepOptions = [15, 30, 45, 60];

  return (
    <Modal visible={playerModalVisible} animationType="slide" transparent={false} onRequestClose={() => setPlayerModalVisible(false)}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => setPlayerModalVisible(false)}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Lecteur Audio</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Center Display Card */}
        <View style={styles.content}>
          <View style={[styles.displayCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.bookTitle, { color: theme.colors.accent }]}>{bookName}</Text>
            <Text style={[styles.chapterTitle, { color: theme.colors.text }]}>
              Chapitre {activeChapter}
            </Text>
            {currentVerseNum && (
              <Text style={[styles.verseIndicator, { color: theme.colors.textMuted }]}>
                Verset {currentVerseNum}
              </Text>
            )}
          </View>

          {/* Main Transport Controls */}
          <View style={styles.transportRow}>
            <TouchableOpacity style={styles.controlBtn} onPress={() => audioService.prevVerse()}>
              <SkipBack size={28} color={theme.colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.playBtn, { backgroundColor: theme.colors.accent }]}
              onPress={handlePlayPause}
            >
              {isPaused ? (
                <Play size={32} color={theme.colors.accentText} />
              ) : (
                <Pause size={32} color={theme.colors.accentText} />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn} onPress={() => audioService.nextVerse()}>
              <SkipForward size={28} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Speed Rate Selector */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Vitesse de lecture</Text>
            <View style={styles.row}>
              {rates.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.chip,
                    {
                      borderColor: playbackRate === r ? theme.colors.accent : theme.colors.border,
                      backgroundColor: playbackRate === r ? theme.colors.surfaceVariant : theme.colors.surface,
                    },
                  ]}
                  onPress={() => audioService.setRate(r)}
                >
                  <Text
                    style={{
                      color: playbackRate === r ? theme.colors.accent : theme.colors.text,
                      fontWeight: 'bold',
                      fontSize: 13,
                    }}
                  >
                    {r}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sleep Timer */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Moon size={18} color={theme.colors.accent} />
              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
                Minuterie de sommeil {sleepTimerMinutes ? `(${sleepTimerMinutes} min)` : ''}
              </Text>
            </View>

            <View style={styles.row}>
              {sleepOptions.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.chip,
                    {
                      borderColor: sleepTimerMinutes === m ? theme.colors.accent : theme.colors.border,
                      backgroundColor: sleepTimerMinutes === m ? theme.colors.surfaceVariant : theme.colors.surface,
                    },
                  ]}
                  onPress={() => audioService.setSleepTimer(m)}
                >
                  <Text
                    style={{
                      color: sleepTimerMinutes === m ? theme.colors.accent : theme.colors.text,
                      fontWeight: 'bold',
                      fontSize: 13,
                    }}
                  >
                    {m} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 24, justifyContent: 'space-around' },
  displayCard: {
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  bookTitle: { fontSize: 24, fontWeight: 'bold' },
  chapterTitle: { fontSize: 20, fontWeight: '600' },
  verseIndicator: { fontSize: 16, marginTop: 8 },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  controlBtn: { padding: 12 },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: { gap: 8 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold' },
  row: { flexDirection: 'row', gap: 8 },
  chip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
  },
});
