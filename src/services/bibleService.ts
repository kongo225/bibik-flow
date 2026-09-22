import { bibleRepository, BibleVersion, Book, Verse, Highlight, Note } from '../data/repositories/bibleRepository';

export const bibleService = {
  getVersions(): Promise<BibleVersion[]> {
    return bibleRepository.getVersions();
  },

  getBooks(language = 'fr'): Promise<Book[]> {
    return bibleRepository.getBooks(language);
  },

  getBook(bookId: number, language = 'fr'): Promise<Book | null> {
    return bibleRepository.getBook(bookId, language);
  },

  getChapterVerses(versionId: string, bookId: number, chapter: number): Promise<Verse[]> {
    return bibleRepository.getChapterVerses(versionId, bookId, chapter);
  },

  getHighlights(versionId: string, bookId: number, chapter: number): Promise<Highlight[]> {
    return bibleRepository.getHighlights(versionId, bookId, chapter);
  },

  setHighlight(versionId: string, bookId: number, chapter: number, verse: number, color: string): Promise<void> {
    return bibleRepository.setHighlight(versionId, bookId, chapter, verse, color);
  },

  getNotes(bookId: number, chapter: number): Promise<Note[]> {
    return bibleRepository.getNotes(bookId, chapter);
  },

  saveNote(bookId: number, chapter: number, verse: number, content: string): Promise<void> {
    return bibleRepository.saveNote(bookId, chapter, verse, content);
  },

  toggleBookmark(bookId: number, chapter: number, verse: number): Promise<boolean> {
    return bibleRepository.toggleBookmark(bookId, chapter, verse);
  },
};
