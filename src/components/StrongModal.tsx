import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { StrongEntry, SearchResult } from '../data/repositories/searchRepository';
import { searchService } from '../services/searchService';
import { X, BookOpen } from 'lucide-react-native';

interface StrongModalProps {
  strongId: string | null;
  onClose: () => void;
  onSelectVerse: (bookId: number, chapter: number, verse: number) => void;
}

export const StrongModal: React.FC<StrongModalProps> = ({ strongId, onClose, onSelectVerse }) => {
  const theme = useTheme();
  const [entry, setEntry] = React.useState<StrongEntry | null>(null);
  const [occurrences, setOccurrences] = React.useState<SearchResult[]>([]);

  React.useEffect(() => {
    if (strongId) {
      searchService.getStrongEntry(strongId).then(setEntry);
      searchService.getStrongOccurrences(strongId).then(setOccurrences);
    }
  }, [strongId]);

  if (!strongId) return null;

  return (
    <Modal visible={!!strongId} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>Fiche Strong ({strongId})</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {entry ? (
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.original, { color: theme.colors.accent }]}>{entry.original}</Text>
              <Text style={[styles.translit, { color: theme.colors.text }]}>
                {entry.transliteration} ({entry.pronunciation})
              </Text>
              <Text style={[styles.def, { color: theme.colors.text }]}>{entry.definition_fr}</Text>
              <Text style={[styles.usage, { color: theme.colors.textMuted }]}>{entry.usage_fr}</Text>
            </View>
          ) : (
            <Text style={{ color: theme.colors.textMuted }}>Chargement de la fiche...</Text>
          )}

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Occurrences ({occurrences.length})
          </Text>

          {occurrences.map((occ) => (
            <TouchableOpacity
              key={`${occ.book_id}-${occ.chapter}-${occ.verse}`}
              style={[styles.occItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => {
                onSelectVerse(occ.book_id, occ.chapter, occ.verse);
                onClose();
              }}
            >
              <Text style={[styles.occRef, { color: theme.colors.accent }]}>
                {occ.book_name} {occ.chapter}:{occ.verse}
              </Text>
              <Text style={[styles.occText, { color: theme.colors.text }]}>{occ.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 16, gap: 16 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 8 },
  original: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  translit: { fontSize: 16, fontStyle: 'italic', textAlign: 'center' },
  def: { fontSize: 15, lineHeight: 22 },
  usage: { fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  occItem: { padding: 12, borderRadius: 8, borderWidth: 1, gap: 4 },
  occRef: { fontSize: 14, fontWeight: 'bold' },
  occText: { fontSize: 14 },
});
