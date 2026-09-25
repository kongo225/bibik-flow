import { getDatabase } from './database';
import { BIBLE_BOOKS } from './seed/booksData';
import { SAMPLE_VERSES } from './seed/sampleVerses';
import { STRONG_LEXICON_SAMPLE, VERSE_WORDS_SAMPLE } from './seed/strongData';
import { VERSE_OF_DAY_SAMPLE } from './seed/verseOfDayData';
import { READING_PLANS_SAMPLE } from './seed/readingPlansData';
import {
  COMMENTARIES_SAMPLE,
  COMMENTARY_ENTRIES_SAMPLE,
  DICTIONARY_SAMPLE,
  TIMELINES_SAMPLE,
  TIMELINE_EVENTS_SAMPLE,
} from './seed/studyData';

export const seedDatabase = async (): Promise<void> => {
  const db = await getDatabase();

  // Check if versions already exist
  const existingVersions = (await db.getAllAsync('SELECT id FROM versions;')) as { id: string }[];
  if (existingVersions.length > 0) {
    return; // Already seeded
  }

  // 1. Insert Versions
  await db.execAsync(`
    INSERT INTO versions (id, name, abbreviation, language, license, size_mb, is_downloaded, has_strong) VALUES
    ('lsg', 'Louis Segond 1910', 'LSG', 'fr', 'Domaine Public', 4.5, 1, 1),
    ('darby', 'Bible Darby', 'DRB', 'fr', 'Domaine Public', 4.2, 1, 0);
  `);

  // 2. Insert Books and Book Names
  for (const book of BIBLE_BOOKS) {
    await db.runAsync(
      `INSERT INTO books (id, code, testament, chapters_count, order_index) VALUES (?, ?, ?, ?, ?);`,
      [book.id, book.code, book.testament, book.chapters_count, book.id]
    );

    await db.runAsync(
      `INSERT INTO book_names (book_id, language, name, abbreviation) VALUES (?, 'fr', ?, ?);`,
      [book.id, book.name_fr, book.abbr_fr]
    );

    await db.runAsync(
      `INSERT INTO book_names (book_id, language, name, abbreviation) VALUES (?, 'en', ?, ?);`,
      [book.id, book.name_en, book.abbr_en]
    );
  }

  // 3. Insert Sample Verses
  for (const v of SAMPLE_VERSES) {
    await db.runAsync(
      `INSERT INTO verses (version_id, book_id, chapter, verse, text) VALUES (?, ?, ?, ?, ?);`,
      [v.version_id, v.book_id, v.chapter, v.verse, v.text]
    );

    await db.runAsync(
      `INSERT INTO verses_fts (text) VALUES (?);`,
      [v.text]
    );
  }

  // 4. Insert Strong Lexicon entries
  for (const s of STRONG_LEXICON_SAMPLE) {
    await db.runAsync(
      `INSERT INTO strong_lexicon (strong_id, original, transliteration, pronunciation, definition_fr, usage_fr) VALUES (?, ?, ?, ?, ?, ?);`,
      [s.strong_id, s.original, s.transliteration, s.pronunciation, s.definition_fr, s.usage_fr]
    );
  }

  // 5. Insert Verse Words mapping
  for (const vw of VERSE_WORDS_SAMPLE) {
    await db.runAsync(
      `INSERT INTO verse_words (version_id, book_id, chapter, verse, position, word, strong_id) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [vw.version_id, vw.book_id, vw.chapter, vw.verse, vw.position, vw.word, vw.strong_id]
    );
  }

  // 6. Insert Verse of the Day seed
  for (const vod of VERSE_OF_DAY_SAMPLE) {
    await db.runAsync(
      `INSERT INTO verse_of_day (date, book_id, chapter, verse) VALUES (?, ?, ?, ?);`,
      [`2025-01-0${vod.day_of_year}`, vod.book_id, vod.chapter, vod.verse]
    );
  }

  // 7. Insert Reading Plans seed
  for (const plan of READING_PLANS_SAMPLE) {
    await db.runAsync(
      `INSERT INTO reading_plans (id, title, duration_days, description, type) VALUES (?, ?, ?, ?, ?);`,
      [plan.id, plan.title, plan.duration_days, plan.description, plan.type]
    );

    for (const dayItem of plan.days) {
      await db.runAsync(
        `INSERT INTO reading_plan_days (plan_id, day, readings) VALUES (?, ?, ?);`,
        [plan.id, dayItem.day, JSON.stringify(dayItem.readings)]
      );
    }
  }

  // 8. Insert Commentaries
  for (const c of COMMENTARIES_SAMPLE) {
    await db.runAsync(
      `INSERT INTO commentaries (id, name, author, language, is_downloaded) VALUES (?, ?, ?, ?, ?);`,
      [c.id, c.name, c.author, c.language, c.is_downloaded]
    );
  }

  for (const ce of COMMENTARY_ENTRIES_SAMPLE) {
    await db.runAsync(
      `INSERT INTO commentary_entries (commentary_id, book_id, chapter, verse_start, verse_end, text) VALUES (?, ?, ?, ?, ?, ?);`,
      [ce.commentary_id, ce.book_id, ce.chapter, ce.verse_start, ce.verse_end, ce.text]
    );
  }

  // 9. Insert Dictionary entries
  for (const dict of DICTIONARY_SAMPLE) {
    await db.runAsync(
      `INSERT INTO dictionary_entries (id, term, category, definition, related_refs) VALUES (?, ?, ?, ?, ?);`,
      [dict.id, dict.term, dict.category, dict.definition, dict.related_refs]
    );
  }

  // 10. Insert Timelines & Events
  for (const tl of TIMELINES_SAMPLE) {
    await db.runAsync(
      `INSERT INTO timelines (id, title, description) VALUES (?, ?, ?);`,
      [tl.id, tl.title, tl.description]
    );
  }

  for (const tle of TIMELINE_EVENTS_SAMPLE) {
    await db.runAsync(
      `INSERT INTO timeline_events (id, timeline_id, title, description, date_label, year_start, year_end, era, refs, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [tle.id, tle.timeline_id, tle.title, tle.description, tle.date_label, tle.year_start, tle.year_end, tle.era, tle.refs, tle.category]
    );
  }

  console.log('Database seeded with complete Phase 5 study content!');
};
