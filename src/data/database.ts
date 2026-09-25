import { Platform } from 'react-native';
import { seedDatabase } from './seedDatabase';

const DB_NAME = 'bibleapp.db';

let dbInstance: any = null;

export const getDatabase = async (): Promise<any> => {
  if (Platform.OS === 'web') {
    return {
      execAsync: async () => {},
      runAsync: async () => {},
      getAllAsync: async () => [],
      getFirstAsync: async () => null,
    };
  }

  if (!dbInstance) {
    const SQLite = require('expo-sqlite');
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbInstance;
};

export const initDatabase = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    return;
  }

  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    -- Versions de Bible
    CREATE TABLE IF NOT EXISTS versions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      abbreviation TEXT NOT NULL,
      language TEXT NOT NULL,
      license TEXT,
      size_mb REAL,
      is_downloaded INTEGER DEFAULT 0,
      has_strong INTEGER DEFAULT 0
    );

    -- Livres (référentiel commun à toutes les versions)
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY,
      code TEXT,
      testament TEXT,
      chapters_count INTEGER,
      order_index INTEGER
    );

    CREATE TABLE IF NOT EXISTS book_names (
      book_id INTEGER,
      language TEXT,
      name TEXT,
      abbreviation TEXT,
      PRIMARY KEY (book_id, language),
      FOREIGN KEY (book_id) REFERENCES books(id)
    );

    -- Versets
    CREATE TABLE IF NOT EXISTS verses (
      version_id TEXT,
      book_id INTEGER,
      chapter INTEGER,
      verse INTEGER,
      text TEXT NOT NULL,
      PRIMARY KEY (version_id, book_id, chapter, verse)
    );

    -- Virtual table FTS5 for full-text search
    CREATE VIRTUAL TABLE IF NOT EXISTS verses_fts USING fts5(text, content='verses');

    -- Mots avec numéros Strong (concordance)
    CREATE TABLE IF NOT EXISTS verse_words (
      version_id TEXT,
      book_id INTEGER,
      chapter INTEGER,
      verse INTEGER,
      position INTEGER,
      word TEXT,
      strong_id TEXT
    );

    CREATE TABLE IF NOT EXISTS strong_lexicon (
      strong_id TEXT PRIMARY KEY,
      original TEXT,
      transliteration TEXT,
      pronunciation TEXT,
      definition_fr TEXT,
      usage_fr TEXT
    );

    -- Lexique / dictionnaire biblique
    CREATE TABLE IF NOT EXISTS dictionary_entries (
      id INTEGER PRIMARY KEY,
      term TEXT,
      category TEXT,
      definition TEXT,
      related_refs TEXT
    );

    -- Commentaires
    CREATE TABLE IF NOT EXISTS commentaries (
      id TEXT PRIMARY KEY,
      name TEXT,
      author TEXT,
      language TEXT,
      is_downloaded INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS commentary_entries (
      commentary_id TEXT,
      book_id INTEGER,
      chapter INTEGER,
      verse_start INTEGER,
      verse_end INTEGER,
      text TEXT
    );

    -- Chronologies
    CREATE TABLE IF NOT EXISTS timelines (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS timeline_events (
      id INTEGER PRIMARY KEY,
      timeline_id TEXT,
      title TEXT,
      description TEXT,
      date_label TEXT,
      year_start INTEGER,
      year_end INTEGER,
      era TEXT,
      refs TEXT,
      category TEXT
    );

    -- Plans de lecture
    CREATE TABLE IF NOT EXISTS reading_plans (
      id TEXT PRIMARY KEY,
      title TEXT,
      duration_days INTEGER,
      description TEXT,
      type TEXT DEFAULT 'general'
    );

    CREATE TABLE IF NOT EXISTS reading_plan_days (
      plan_id TEXT,
      day INTEGER,
      readings TEXT,
      PRIMARY KEY (plan_id, day)
    );

    CREATE TABLE IF NOT EXISTS user_plan_progress (
      plan_id TEXT,
      start_date TEXT,
      day INTEGER,
      completed INTEGER DEFAULT 0,
      completed_at TEXT,
      PRIMARY KEY (plan_id, day)
    );

    -- Données utilisateur
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INT,
      chapter INT,
      verse INT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS highlights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version_id TEXT,
      book_id INT,
      chapter INT,
      verse INT,
      color TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INT,
      chapter INT,
      verse INT,
      content TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS verse_of_day (
      date TEXT PRIMARY KEY,
      book_id INT,
      chapter INT,
      verse INT
    );
  `);

  await seedDatabase();
};
