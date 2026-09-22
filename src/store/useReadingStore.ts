import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReadingState {
  currentVersionId: string;
  currentBookId: number;
  currentChapter: number;
  currentVerse: number;
  setCurrentVersionId: (versionId: string) => void;
  setCurrentBookId: (bookId: number) => void;
  setCurrentChapter: (chapter: number) => void;
  setCurrentVerse: (verse: number) => void;
  setReadingPosition: (versionId: string, bookId: number, chapter: number, verse?: number) => void;
  loadReadingPosition: () => Promise<void>;
}

export const useReadingStore = create<ReadingState>((set) => ({
  currentVersionId: 'lsg',
  currentBookId: 1, // Genesis
  currentChapter: 1,
  currentVerse: 1,

  setCurrentVersionId: (versionId) => {
    set({ currentVersionId: versionId });
    AsyncStorage.setItem('read_version_id', versionId);
  },

  setCurrentBookId: (bookId) => {
    set({ currentBookId: bookId });
    AsyncStorage.setItem('read_book_id', bookId.toString());
  },

  setCurrentChapter: (chapter) => {
    set({ currentChapter: chapter });
    AsyncStorage.setItem('read_chapter', chapter.toString());
  },

  setCurrentVerse: (verse) => {
    set({ currentVerse: verse });
    AsyncStorage.setItem('read_verse', verse.toString());
  },

  setReadingPosition: (versionId, bookId, chapter, verse = 1) => {
    set({
      currentVersionId: versionId,
      currentBookId: bookId,
      currentChapter: chapter,
      currentVerse: verse,
    });
    AsyncStorage.setItem('read_version_id', versionId);
    AsyncStorage.setItem('read_book_id', bookId.toString());
    AsyncStorage.setItem('read_chapter', chapter.toString());
    AsyncStorage.setItem('read_verse', verse.toString());
  },

  loadReadingPosition: async () => {
    try {
      const versionId = await AsyncStorage.getItem('read_version_id');
      const bookId = await AsyncStorage.getItem('read_book_id');
      const chapter = await AsyncStorage.getItem('read_chapter');
      const verse = await AsyncStorage.getItem('read_verse');

      set({
        currentVersionId: versionId || 'lsg',
        currentBookId: bookId ? parseInt(bookId, 10) : 1,
        currentChapter: chapter ? parseInt(chapter, 10) : 1,
        currentVerse: verse ? parseInt(verse, 10) : 1,
      });
    } catch (e) {
      console.error('Failed to load reading position from storage', e);
    }
  },
}));
