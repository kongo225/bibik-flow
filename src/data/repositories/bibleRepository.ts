import { getDatabase } from '../database';

export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
  license: string;
  size_mb: number;
  is_downloaded: number;
  has_strong: number;
}

export interface Book {
  id: number;
  code: string;
  testament: 'AT' | 'NT';
  chapters_count: number;
  order_index: number;
  name: string;
  abbreviation: string;
}

export interface Verse {
  version_id: string;
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
}

export interface Highlight {
  id: number;
  version_id: string;
  book_id: number;
  chapter: number;
  verse: number;
  color: string;
}

export interface Note {
  id: number;
  book_id: number;
  chapter: number;
  verse: number;
  content: string;
  created_at: string;
}

export const bibleRepository = {
  async getVersions(): Promise<BibleVersion[]> {
    const db = await getDatabase();
    return db.getAllAsync<BibleVersion>('SELECT * FROM versions;');
  },

  async getBooks(language = 'fr'): Promise<Book[]> {
    const db = await getDatabase();
    return db.getAllAsync<Book>(
      `SELECT b.id, b.code, b.testament, b.chapters_count, b.order_index, bn.name, bn.abbreviation
       FROM books b
       JOIN book_names bn ON b.id = bn.book_id
       WHERE bn.language = ?
       ORDER BY b.order_index ASC;`,
      [language]
    );
  },

  async getBook(bookId: number, language = 'fr'): Promise<Book | null> {
    const db = await getDatabase();
    return db.getFirstAsync<Book>(
      `SELECT b.id, b.code, b.testament, b.chapters_count, b.order_index, bn.name, bn.abbreviation
       FROM books b
       JOIN book_names bn ON b.id = bn.book_id
       WHERE b.id = ? AND bn.language = ?;`,
      [bookId, language]
    );
  },

  async getChapterVerses(versionId: string, bookId: number, chapter: number): Promise<Verse[]> {
    const db = await getDatabase();
    return db.getAllAsync<Verse>(
      `SELECT version_id, book_id, chapter, verse, text
       FROM verses
       WHERE version_id = ? AND book_id = ? AND chapter = ?
       ORDER BY verse ASC;`,
      [versionId, bookId, chapter]
    );
  },

  async getHighlights(versionId: string, bookId: number, chapter: number): Promise<Highlight[]> {
    const db = await getDatabase();
    return db.getAllAsync<Highlight>(
      `SELECT * FROM highlights WHERE version_id = ? AND book_id = ? AND chapter = ?;`,
      [versionId, bookId, chapter]
    );
  },

  async setHighlight(versionId: string, bookId: number, chapter: number, verse: number, color: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `DELETE FROM highlights WHERE version_id = ? AND book_id = ? AND chapter = ? AND verse = ?;`,
      [versionId, bookId, chapter, verse]
    );
    if (color) {
      await db.runAsync(
        `INSERT INTO highlights (version_id, book_id, chapter, verse, color, created_at) VALUES (?, ?, ?, ?, ?, ?);`,
        [versionId, bookId, chapter, verse, color, new Date().toISOString()]
      );
    }
  },

  async getNotes(bookId: number, chapter: number): Promise<Note[]> {
    const db = await getDatabase();
    return db.getAllAsync<Note>(
      `SELECT * FROM notes WHERE book_id = ? AND chapter = ?;`,
      [bookId, chapter]
    );
  },

  async saveNote(bookId: number, chapter: number, verse: number, content: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO notes (book_id, chapter, verse, content, created_at) VALUES (?, ?, ?, ?, ?);`,
      [bookId, chapter, verse, content, new Date().toISOString()]
    );
  },

  async getBookmarks(): Promise<{ id: number; book_id: number; chapter: number; verse: number; created_at: string }[]> {
    const db = await getDatabase();
    return db.getAllAsync('SELECT * FROM bookmarks ORDER BY created_at DESC;');
  },

  async toggleBookmark(bookId: number, chapter: number, verse: number): Promise<boolean> {
    const db = await getDatabase();
    const existing = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM bookmarks WHERE book_id = ? AND chapter = ? AND verse = ?;`,
      [bookId, chapter, verse]
    );
    if (existing) {
      await db.runAsync(`DELETE FROM bookmarks WHERE id = ?;`, [existing.id]);
      return false;
    } else {
      await db.runAsync(
        `INSERT INTO bookmarks (book_id, chapter, verse, created_at) VALUES (?, ?, ?, ?);`,
        [bookId, chapter, verse, new Date().toISOString()]
      );
      return true;
    }
  },
};
