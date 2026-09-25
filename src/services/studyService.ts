import { getDatabase } from '../data/database';

export interface CommentaryEntry {
  commentary_id: string;
  name: string;
  author: string;
  text: string;
}

export interface DictionaryEntry {
  id: number;
  term: string;
  category: string;
  definition: string;
  related_refs: string;
}

export interface TimelineEvent {
  id: number;
  timeline_id: string;
  title: string;
  description: string;
  date_label: string;
  year_start: number;
  year_end: number;
  era: string;
  refs: string;
  category: string;
}

export const studyService = {
  async getCommentariesForVerse(bookId: number, chapter: number, verse: number): Promise<CommentaryEntry[]> {
    const db = await getDatabase();
    return db.getAllAsync(
      `SELECT c.id as commentary_id, c.name, c.author, ce.text
       FROM commentary_entries ce
       JOIN commentaries c ON ce.commentary_id = c.id
       WHERE ce.book_id = ? AND ce.chapter = ? AND ? BETWEEN ce.verse_start AND ce.verse_end;`,
      [bookId, chapter, verse]
    ) as Promise<CommentaryEntry[]>;
  },

  async getDictionaryEntries(query = ''): Promise<DictionaryEntry[]> {
    const db = await getDatabase();
    if (!query.trim()) {
      return db.getAllAsync('SELECT * FROM dictionary_entries ORDER BY term ASC;') as Promise<DictionaryEntry[]>;
    }
    return db.getAllAsync(
      'SELECT * FROM dictionary_entries WHERE term LIKE ? OR definition LIKE ? ORDER BY term ASC;',
      [`%${query}%`, `%${query}%`]
    ) as Promise<DictionaryEntry[]>;
  },

  async getTimelineEvents(timelineId = 'grand_chronology'): Promise<TimelineEvent[]> {
    const db = await getDatabase();
    return db.getAllAsync(
      'SELECT * FROM timeline_events WHERE timeline_id = ? ORDER BY year_start ASC;',
      [timelineId]
    ) as Promise<TimelineEvent[]>;
  },
};
