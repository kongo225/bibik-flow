import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { studyService, CommentaryEntry } from '../services/studyService';
import { Verse } from '../data/repositories/bibleRepository';
import { X, BookOpen } from 'lucide-react-native';

interface CommentarySheetProps {
  verse: Verse | null;
  bookName: string;
  onClose: () => void;
}

export const CommentarySheet: React.FC<CommentarySheetProps> = ({ verse, bookName, onClose }) => {
  const theme = useTheme();
  const [commentaries, setCommentaries] = useState<CommentaryEntry[]>([]);

  useEffect(() => {
    if (verse) {
      studyService.getCommentariesForVerse(verse.book_id, verse.chapter, verse.verse).then(setCommentaries);
    }
  }, [verse]);

  if (!verse) return null;

  return (
    <Modal visible={!!verse} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onStartShouldSetResponder={() => true}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <BookOpen size={20} color={theme.colors.accent} />
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Commentaires : {bookName} {verse.chapter}:{verse.verse}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView contentContainerStyle={styles.content}>
            {commentaries.length === 0 ? (
              <Text style={{ color: theme.colors.textMuted, fontStyle: 'italic' }}>
                Aucun commentaire disponible pour ce verset.
              </Text>
            ) : (
              commentaries.map((c, idx) => (
                <View key={idx} style={[styles.card, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                  <Text style={[styles.author, { color: theme.colors.accent }]}>{c.name} ({c.author})</Text>
                  <Text style={[styles.text, { color: theme.colors.text }]}>{c.text}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, maxHeight: '70%', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 16, fontWeight: 'bold' },
  content: { gap: 12, paddingBottom: 20 },
  card: { padding: 12, borderRadius: 12, borderWidth: 1, gap: 6 },
  author: { fontSize: 13, fontWeight: 'bold' },
  text: { fontSize: 14, lineHeight: 20 },
});
