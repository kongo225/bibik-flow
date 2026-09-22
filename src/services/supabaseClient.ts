import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://nuojzvrubgqmzpemwmdv.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51b2p6dnJ1YmdxbXpwZW13bWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTYzOTAsImV4cCI6MjEwNTA3MjM5MH0.VT5E8JJS5iQTbK6DbS1xsruvwHMXmDsz_x0e3MTjVL8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export const supabaseSyncService = {
  async syncBookmarkToCloud(bookId: number, chapter: number, verse: number): Promise<void> {
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
