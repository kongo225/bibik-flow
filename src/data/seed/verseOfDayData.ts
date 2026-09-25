export interface DailyVerseSeed {
  day_of_year: number; // 1 to 365
  book_id: number;
  chapter: number;
  verse: number;
  theme: string;
}

export const VERSE_OF_DAY_SAMPLE: DailyVerseSeed[] = [
  { day_of_year: 1, book_id: 1, chapter: 1, verse: 1, theme: 'Création & Espérance' },
  { day_of_year: 2, book_id: 43, chapter: 1, verse: 1, theme: 'La Parole de Vie' },
  { day_of_year: 3, book_id: 43, chapter: 3, verse: 16, theme: 'Amour Divin' },
  { day_of_year: 4, book_id: 19, chapter: 23, verse: 1, theme: 'Confiance' },
  { day_of_year: 5, book_id: 20, chapter: 3, verse: 5, theme: 'Sagesse' },
  { day_of_year: 6, book_id: 66, chapter: 22, verse: 20, theme: 'Espérance' },
];
