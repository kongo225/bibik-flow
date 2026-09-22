import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { searchService } from '../services/searchService';
import { SearchResult } from '../data/repositories/searchRepository';
import { useReadingStore } from '../store/useReadingStore';
import { StrongModal } from '../components/StrongModal';
import { Search, X, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export const SearchScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { setReadingPosition } = useReadingStore();

  const [query, setQuery] = useState('');
  const [testament, setTestament] = useState<'ALL' | 'AT' | 'NT'>('ALL');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedStrongId, setSelectedStrongId] = useState<string | null>(null);

  const performSearch = async (text: string) => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    // Check if user typed a direct verse reference (requires verse specifier or submit)
    const parsedRef = await searchService.parseReference(text, i18n.language);
    if (parsedRef && parsedRef.verse) {
      setReadingPosition('lsg', parsedRef.book_id, parsedRef.chapter, parsedRef.verse);
      router.push('/(tabs)/bible');
      return;
    }

    // Keyword Search
    const data = await searchService.searchVerses(text, 'lsg', testament, i18n.language);
    setResults(data);
  };

  const handleTextChange = (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      performSearch(text);
    } else if (!text.trim()) {
      setResults([]);
    }
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    const parsedRef = await searchService.parseReference(query, i18n.language);
    if (parsedRef) {
      setReadingPosition('lsg', parsedRef.book_id, parsedRef.chapter, parsedRef.verse || 1);
      router.push('/(tabs)/bible');
    } else {
      performSearch(query);
    }
  };

  const handleSelectVerse = (bookId: number, chapter: number, verse: number) => {
    setReadingPosition('lsg', bookId, chapter, verse);
    router.push('/(tabs)/bible');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Input Bar */}
      <View style={[styles.searchBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Search size={20} color={theme.colors.textMuted} />
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder={t('search.placeholder')}
          placeholderTextColor={theme.colors.textMuted}
          value={query}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSubmit}
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleTextChange('')}>
            <X size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Testament Filter Bar */}
      <View style={[styles.filterRow, { backgroundColor: theme.colors.surfaceVariant }]}>
        {(['ALL', 'AT', 'NT'] as const).map((tFilter) => (
          <TouchableOpacity
            key={tFilter}
            style={[
              styles.filterTab,
              testament === tFilter && { backgroundColor: theme.colors.accent, borderRadius: 16 },
            ]}
            onPress={() => {
              setTestament(tFilter);
              if (query) performSearch(query);
            }}
          >
            <Text
              style={[
                styles.filterText,
                { color: testament === tFilter ? theme.colors.accentText : theme.colors.textMuted },
              ]}
            >
              {tFilter === 'ALL' ? 'Tous' : tFilter === 'AT' ? 'Ancien T.' : 'Nouveau T.'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Strong Quick Chips */}
      <View style={styles.strongRow}>
        <Text style={[styles.strongLabel, { color: theme.colors.textMuted }]}>Strong :</Text>
        {['G2316 (Dieu)', 'G026 (Amour)', 'G5485 (Grâce)', 'H430 (Elohim)'].map((label, idx) => {
          const ids = ['G2316', 'G026', 'G5485', 'H430'];
          return (
            <TouchableOpacity
              key={label}
              style={[styles.strongChip, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
              onPress={() => setSelectedStrongId(ids[idx])}
            >
              <Text style={{ fontSize: 11, color: theme.colors.accent, fontWeight: 'bold' }}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Results Header */}
      {query.length > 0 && (
        <Text style={[styles.resultCount, { color: theme.colors.textMuted }]}>
          {results.length} résultat(s) trouvé(s)
        </Text>
      )}

      {/* Results List */}
      <FlatList
        data={results}
        keyExtractor={(item) => `${item.version_id}-${item.book_id}-${item.chapter}-${item.verse}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => handleSelectVerse(item.book_id, item.chapter, item.verse)}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.ref, { color: theme.colors.accent }]}>
                {item.book_name} {item.chapter}:{item.verse}
              </Text>
              <ArrowRight size={16} color={theme.colors.textMuted} />
            </View>
            <Text style={[styles.text, { color: theme.colors.text }]}>{item.text}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Strong Lexicon Sheet / Modal */}
      <StrongModal
        strongId={selectedStrongId}
        onClose={() => setSelectedStrongId(null)}
        onSelectVerse={handleSelectVerse}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
    marginBottom: 12,
  },
  input: { flex: 1, fontSize: 16 },
  filterRow: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  filterTab: { flex: 1, paddingVertical: 6, alignItems: 'center' },
  filterText: { fontWeight: '600', fontSize: 13 },
  strongRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  strongLabel: { fontSize: 12, fontWeight: 'bold' },
  strongChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  resultCount: { fontSize: 12, marginBottom: 8, fontStyle: 'italic' },
  listContent: { gap: 10, paddingBottom: 20 },
  card: { padding: 12, borderRadius: 12, borderWidth: 1, gap: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ref: { fontSize: 14, fontWeight: 'bold' },
  text: { fontSize: 14, lineHeight: 20 },
});
