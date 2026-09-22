import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Verse } from '../data/repositories/bibleRepository';
import { bibleService } from '../services/bibleService';
import { Share2, Bookmark } from 'lucide-react-native';

interface VerseActionMenuProps {
  verse: Verse | null;
  bookName: string;
  onClose: () => void;
  onRefresh: () => void;
}

const HIGHLIGHT_COLORS = ['#FEF08A', '#BBF7D0', '#BFDBFE', '#FBCFE8', '#FED7AA'];

export const VerseActionMenu: React.FC<VerseActionMenuProps> = ({ verse, bookName, onClose, onRefresh }) => {
  const theme = useTheme();

  if (!verse) return null;

  const refText = `${bookName} ${verse.chapter}:${verse.verse} (${verse.version_id.toUpperCase()})`;

  const handleCopy = () => {
    Share.share({
      message: `"${verse.text}" — ${refText}`,
    });
    onClose();
  };

  const handleHighlight = async (color: string) => {
    await bibleService.setHighlight(verse.version_id, verse.book_id, verse.chapter, verse.verse, color);
    onRefresh();
    onClose();
  };

  const handleBookmark = async () => {
    await bibleService.toggleBookmark(verse.book_id, verse.chapter, verse.verse);
    onRefresh();
    onClose();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text style={[styles.refHeader, { color: theme.colors.accent }]}>{refText}</Text>

      {/* Colors Bar */}
      <View style={styles.colorRow}>
        {HIGHLIGHT_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorCircle, { backgroundColor: color }]}
            onPress={() => handleHighlight(color)}
          />
        ))}
        <TouchableOpacity
          style={[styles.colorCircle, { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.textMuted }]}
          onPress={() => handleHighlight('')}
        >
          <Text style={{ fontSize: 10, color: theme.colors.textMuted }}>Effacer</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleCopy}>
          <Share2 size={20} color={theme.colors.text} />
          <Text style={[styles.actionLabel, { color: theme.colors.text }]}>Partager</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleBookmark}>
          <Bookmark size={20} color={theme.colors.text} />
          <Text style={[styles.actionLabel, { color: theme.colors.text }]}>Favori</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
          <Text style={[styles.actionLabel, { color: theme.colors.accent, fontWeight: 'bold' }]}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  refHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  actionLabel: {
    fontSize: 12,
  },
});
