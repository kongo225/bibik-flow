import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { bibleService } from '../services/bibleService';
import { Book } from '../data/repositories/bibleRepository';
import { X } from 'lucide-react-native';

interface BookPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (bookId: number, chapter: number, verse?: number) => void;
  language?: string;
}

export const BookPicker: React.FC<BookPickerProps> = ({ visible, onClose, onSelect, language = 'fr' }) => {
  const theme = useTheme();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | 'AT' | 'NT'>('ALL');
  const [step, setStep] = useState<'book' | 'chapter'>('book');

  useEffect(() => {
    if (visible) {
      bibleService.getBooks(language).then((data) => {
        setBooks(data);
        if (data.length > 0 && !selectedBook) {
          setSelectedBook(data[0]);
        }
      });
      setStep('book');
    }
  }, [visible, language]);

  const filteredBooks = books.filter((b) => testamentFilter === 'ALL' || b.testament === testamentFilter);

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
    setStep('chapter');
  };

  const handleChapterPress = (chapterNum: number) => {
    if (selectedBook) {
      onSelect(selectedBook.id, chapterNum, 1);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {step === 'book' ? 'Choisir un livre' : `${selectedBook?.name} - Choisir le chapitre`}
          </Text>
          {step === 'chapter' && (
            <TouchableOpacity onPress={() => setStep('book')}>
              <Text style={{ color: theme.colors.accent, fontWeight: '600' }}>Livres</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Testament Filter Bar */}
        {step === 'book' && (
          <View style={[styles.filterBar, { backgroundColor: theme.colors.surfaceVariant }]}>
            {(['ALL', 'AT', 'NT'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  testamentFilter === filter && { backgroundColor: theme.colors.accent, borderRadius: 16 },
                ]}
                onPress={() => setTestamentFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: testamentFilter === filter ? theme.colors.accentText : theme.colors.textMuted },
                  ]}
                >
                  {filter === 'ALL' ? 'Tous' : filter === 'AT' ? 'Ancien T.' : 'Nouveau T.'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Content */}
        {step === 'book' ? (
          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.bookItem, { borderBottomColor: theme.colors.border }]}
                onPress={() => handleBookPress(item)}
              >
                <Text style={[styles.bookName, { color: theme.colors.text }]}>{item.name}</Text>
                <Text style={[styles.chapterCount, { color: theme.colors.textMuted }]}>
                  {item.chapters_count} chapitres
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.chaptersGrid}>
            {Array.from({ length: selectedBook?.chapters_count || 0 }, (_, i) => i + 1).map((num) => (
              <TouchableOpacity
                key={num}
                style={[styles.chapterBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={() => handleChapterPress(num)}
              >
                <Text style={[styles.chapterNumber, { color: theme.colors.text }]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterBar: {
    flexDirection: 'row',
    padding: 4,
    margin: 12,
    borderRadius: 20,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  filterText: {
    fontWeight: '600',
    fontSize: 13,
  },
  bookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  bookName: {
    fontSize: 16,
    fontWeight: '500',
  },
  chapterCount: {
    fontSize: 13,
  },
  chaptersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  chapterBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
