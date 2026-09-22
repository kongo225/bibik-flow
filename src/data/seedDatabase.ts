import { getDatabase } from './database';
import { BIBLE_BOOKS } from './seed/booksData';
import { SAMPLE_VERSES } from './seed/sampleVerses';
import { STRONG_LEXICON_SAMPLE, VERSE_WORDS_SAMPLE } from './seed/strongData';

export const seedDatabase = async (): Promise<void> => {
  const db = await getDatabase();

  // Check if versions already exist
  const existingVersions = await db.getAllAsync<{ id: string }>('SELECT id FROM versions;');
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

    // Also populate FTS table
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

  console.log('Database seeded with books, verses, and Strong lexicon!');
};
