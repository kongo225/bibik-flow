import { getDatabase } from '../data/database';
import { Verse } from '../data/repositories/bibleRepository';

export interface VerseOfDayResult {
  verse: Verse;
  book_name: string;
}

export const verseOfDayService = {
  async getTodayVerse(versionId = 'lsg', language = 'fr'): Promise<VerseOfDayResult | null> {
    const db = await getDatabase();

    // Deterministic selection based on day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Default fallback verse if not found in db
    let row = await db.getFirstAsync<{ book_id: number; chapter: number; verse: number }>(
      `SELECT book_id, chapter, verse FROM verse_of_day LIMIT 1 OFFSET ?;`,
      [dayOfYear % 6]
    );

    if (!row) {
      row = { book_id: 43, chapter: 3, verse: 16 }; // Jean 3:16 default
    }

    const verseData = await db.getFirstAsync<Verse>(
      `SELECT version_id, book_id, chapter, verse, text FROM verses WHERE version_id = ? AND book_id = ? AND chapter = ? AND verse = ?;`,
      [versionId, row.book_id, row.chapter, row.verse]
    );

    const bookData = await db.getFirstAsync<{ name: string }>(
      `SELECT name FROM book_names WHERE book_id = ? AND language = ?;`,
      [row.book_id, language]
    );

    if (!verseData) return null;

    return {
      verse: verseData,
      book_name: bookData?.name || 'Jean',
    };
  },
};
