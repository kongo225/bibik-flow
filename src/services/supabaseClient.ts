import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase configuration missing: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY must be defined in your .env file.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export const supabaseSyncService = {
  async syncBookmarkToCloud(bookId: number, chapter: number, verse: number): Promise<void> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    try {
      await supabase.from('user_bookmarks').insert([
        {
          book_id: bookId,
          chapter: chapter,
          verse: verse,
        },
      ]);
    } catch (e) {
      console.warn('Failed to sync bookmark to Supabase cloud', e);
    }
  },

  async syncHighlightToCloud(
    versionId: string,
    bookId: number,
    chapter: number,
    verse: number,
    color: string
  ): Promise<void> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    try {
      await supabase.from('user_highlights').insert([
        {
          version_id: versionId,
          book_id: bookId,
          chapter: chapter,
          verse: verse,
          color: color,
        },
      ]);
    } catch (e) {
      console.warn('Failed to sync highlight to Supabase cloud', e);
    }
  },

  async syncNoteToCloud(bookId: number, chapter: number, verse: number, content: string): Promise<void> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    try {
      await supabase.from('user_notes').insert([
        {
          book_id: bookId,
          chapter: chapter,
          verse: verse,
          content: content,
        },
      ]);
    } catch (e) {
      console.warn('Failed to sync note to Supabase cloud', e);
    }
  },
};
