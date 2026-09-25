import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useAudioStore } from '../store/useAudioStore';
import { audioService } from '../services/audioService';
import { Play, Pause, Square, Maximize2 } from 'lucide-react-native';

export const MiniAudioPlayer = () => {
  const theme = useTheme();
  const {
    isPlaying,
    isPaused,
    bookName,
    activeChapter,
    currentVerseNum,
    setPlayerModalVisible,
  } = useAudioStore();

  if (!isPlaying) return null;

  const handlePlayPause = () => {
    if (isPaused) {
      audioService.resume();
    } else {
      audioService.pause();
    }
  };

  const handleStop = () => {
    audioService.stop();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => setPlayerModalVisible(true)}
    >
      <View style={styles.leftInfo}>
        <Text style={[styles.passageText, { color: theme.colors.text }]}>
          {bookName} {activeChapter}
          {currentVerseNum ? `:${currentVerseNum}` : ''}
        </Text>
        <Text style={[styles.subText, { color: theme.colors.accent }]}>Lecture audio (TTS)</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.iconBtn} onPress={handlePlayPause}>
          {isPaused ? (
            <Play size={20} color={theme.colors.accent} />
          ) : (
            <Pause size={20} color={theme.colors.accent} />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={handleStop}>
          <Square size={18} color={theme.colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={() => setPlayerModalVisible(true)}>
          <Maximize2 size={18} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 56, // above tab bar
    left: 12,
    right: 12,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  leftInfo: { flex: 1 },
  passageText: { fontSize: 14, fontWeight: 'bold' },
  subText: { fontSize: 11, fontWeight: '500' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { padding: 4 },
});
