import { getDatabase } from '../database';
import { Verse } from './bibleRepository';

export interface SearchResult extends Verse {
  book_name: string;
}

export interface StrongEntry {
  strong_id: string;
  original: string;
  transliteration: string;
  pronunciation: string;
  definition_fr: string;
  usage_fr: string;
}

export const searchRepository = {
  async searchVerses(
    query: string,
    versionId = 'lsg',
    testament: 'ALL' | 'AT' | 'NT' = 'ALL',
    language = 'fr'
  ): Promise<SearchResult[]> {
    const db = await getDatabase();
    const sanitizedQuery = `%${query.trim()}%`;

    let sql = `
      SELECT v.version_id, v.book_id, v.chapter, v.verse, v.text, bn.name as book_name
      FROM verses v
      JOIN books b ON v.book_id = b.id
      JOIN book_names bn ON b.id = bn.book_id
      WHERE v.version_id = ? AND bn.language = ? AND v.text LIKE ?
    `;

    const params: (string | number)[] = [versionId, language, sanitizedQuery];

    if (testament !== 'ALL') {
      sql += ` AND b.testament = ?`;
      params.push(testament);
    }

    sql += ` ORDER BY b.order_index ASC, v.chapter ASC, v.verse ASC LIMIT 100;`;

    return db.getAllAsync(sql, params) as Promise<SearchResult[]>;
  },

  async parseReference(query: string, language = 'fr'): Promise<{ book_id: number; book_name: string; chapter: number; verse?: number } | null> {
    const db = await getDatabase();
    const trimmed = query.trim();

    const match = trimmed.match(/^([1-3]?\s*[a-zA-Zà-ÿÀ-Ÿ]+)\s+(\d+)(?::(\d+))?$/i);
    if (!match) return null;

    const bookSearch = match[1].trim();
    const chapter = parseInt(match[2], 10);
    const verse = match[3] ? parseInt(match[3], 10) : undefined;

    const book = (await db.getFirstAsync(
      `SELECT b.id, bn.name
       FROM books b
       JOIN book_names bn ON b.id = bn.book_id
       WHERE bn.language = ? AND (bn.name LIKE ? OR bn.abbreviation LIKE ?)
       LIMIT 1;`,
      [language, `${bookSearch}%`, `${bookSearch}%`]
    )) as { id: number; name: string } | null;

    if (!book) return null;

    return {
      book_id: book.id,
      book_name: book.name,
      chapter,
      verse,
    };
  },

  async getStrongEntry(strongId: string): Promise<StrongEntry | null> {
    const db = await getDatabase();
    return db.getFirstAsync(
      `SELECT * FROM strong_lexicon WHERE strong_id = ?;`,
      [strongId]
    ) as Promise<StrongEntry | null>;
  },

  async getStrongOccurrences(strongId: string, language = 'fr'): Promise<SearchResult[]> {
    const db = await getDatabase();
    return db.getAllAsync(
      `SELECT v.version_id, v.book_id, v.chapter, v.verse, v.text, bn.name as book_name
       FROM verse_words vw
       JOIN verses v ON vw.version_id = v.version_id AND vw.book_id = v.book_id AND vw.chapter = v.chapter AND vw.verse = v.verse
       JOIN books b ON v.book_id = b.id
       JOIN book_names bn ON b.id = bn.book_id
       WHERE vw.strong_id = ? AND bn.language = ?
       ORDER BY b.order_index ASC, v.chapter ASC, v.verse ASC;`,
      [strongId, language]
    ) as Promise<SearchResult[]>;
  },
};
