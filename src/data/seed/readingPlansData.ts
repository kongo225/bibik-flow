export interface ReadingPlanSeed {
  id: string;
  title: string;
  duration_days: number;
  description: string;
  type: 'general' | 'topical';
  days: {
    day: number;
    readings: { book_id: number; chapter: number }[];
  }[];
}

export const READING_PLANS_SAMPLE: ReadingPlanSeed[] = [
  {
    id: 'plan_1_year',
    title: 'Bible en 1 an',
    duration_days: 365,
    description: 'Lisez toute la Bible en 1 an (Ancien Testament, Nouveau Testament, Psaumes et Proverbes).',
    type: 'general',
    days: [
      {
        day: 1,
        readings: [
          { book_id: 1, chapter: 1 },
          { book_id: 40, chapter: 1 },
          { book_id: 19, chapter: 1 },
        ],
      },
      {
        day: 2,
        readings: [
          { book_id: 1, chapter: 2 },
          { book_id: 40, chapter: 2 },
          { book_id: 19, chapter: 2 },
        ],
      },
    ],
  },
  {
    id: 'plan_topical_faith',
    title: '7 jours sur la Foi',
    duration_days: 7,
    description: 'Méditations quotidiennes pour fortifier votre foi en Dieu.',
    type: 'topical',
    days: [
      {
        day: 1,
        readings: [{ book_id: 58, chapter: 11 }], // Hébreux 11
      },
      {
        day: 2,
        readings: [{ book_id: 45, chapter: 10 }], // Romains 10
      },
    ],
  },
];
