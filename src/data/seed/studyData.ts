export interface CommentarySeed {
  id: string;
  name: string;
  author: string;
  language: string;
  is_downloaded: number;
}

export interface CommentaryEntrySeed {
  commentary_id: string;
  book_id: number;
  chapter: number;
  verse_start: number;
  verse_end: number;
  text: string;
}

export interface DictionaryEntrySeed {
  id: number;
  term: string;
  category: string;
  definition: string;
  related_refs: string;
}

export interface TimelineSeed {
  id: string;
  title: string;
  description: string;
}

export interface TimelineEventSeed {
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

export const COMMENTARIES_SAMPLE: CommentarySeed[] = [
  {
    id: 'matthew_henry',
    name: 'Commentaire de Matthew Henry',
    author: 'Matthew Henry',
    language: 'fr',
    is_downloaded: 1,
  },
  {
    id: 'darby_synopsis',
    name: 'Synopsis de la Bible',
    author: 'John Nelson Darby',
    language: 'fr',
    is_downloaded: 1,
  },
];

export const COMMENTARY_ENTRIES_SAMPLE: CommentaryEntrySeed[] = [
  {
    commentary_id: 'matthew_henry',
    book_id: 1,
    chapter: 1,
    verse_start: 1,
    verse_end: 1,
    text: "La création du monde : au commencement, Dieu créa les cieux et la terre. Tout tire son origine de la puissance créatrice du seul vrai Dieu (Jn 1:1).",
  },
  {
    commentary_id: 'matthew_henry',
    book_id: 43,
    chapter: 3,
    verse_start: 16,
    verse_end: 16,
    text: "L'amour incomparable de Dieu envers l'humanité déchue. Le don souverain du Fils unique Jésus-Christ garantit le salut éternel à quiconque croit (Rm 8:32).",
  },
];

export const DICTIONARY_SAMPLE: DictionaryEntrySeed[] = [
  {
    id: 1,
    term: 'Alliance',
    category: 'Concept',
    definition: 'Accord solennel conclu par Dieu avec les hommes, scellé par des promesses et un signe (ex: l\'arc-en-ciel, la circoncision, le sang du Christ).',
    related_refs: 'Gen 9:12, Heb 8:6',
  },
  {
    id: 2,
    term: 'Grâce',
    category: 'Concept',
    definition: 'Faveur divine accordée gratuitement et sans mérite humain. La source suprême du salut en Jésus-Christ.',
    related_refs: 'Eph 2:8, Rom 3:24',
  },
  {
    id: 3,
    term: 'Tabernacle',
    category: 'Objet / Lieu',
    definition: 'Secteur de culte transportable construit par Moïse au désert pour abriter la présence de Dieu au milieu d\'Israël.',
    related_refs: 'Exo 25:8, Heb 9:1',
  },
];

export const TIMELINES_SAMPLE: TimelineSeed[] = [
  {
    id: 'grand_chronology',
    title: 'Grande Chronologie Biblique',
    description: 'De la Création à l\'Église primitive.',
  },
  {
    id: 'life_of_jesus',
    title: 'Vie de Jésus-Christ',
    description: 'Ministère, passion et résurrection de Jésus.',
  },
];

export const TIMELINE_EVENTS_SAMPLE: TimelineEventSeed[] = [
  {
    id: 1,
    timeline_id: 'grand_chronology',
    title: 'L\'Exode d\'Égypte',
    description: 'Moïse guide le peuple d\'Israël hors de la servitude égyptienne à travers la Mer Rouge.',
    date_label: 'env. 1446 av. J.-C.',
    year_start: -1446,
    year_end: -1446,
    era: 'AT',
    refs: 'Exo 12:31',
    category: 'Histoire',
  },
  {
    id: 2,
    timeline_id: 'grand_chronology',
    title: 'Règne de David',
    description: 'David devient roi sur tout Israël et établit Jérusalem comme capitale.',
    date_label: 'env. 1010 av. J.-C.',
    year_start: -1010,
    year_end: -970,
    era: 'AT',
    refs: '2Sa 5:1',
    category: 'Royaume',
  },
  {
    id: 3,
    timeline_id: 'life_of_jesus',
    title: 'Naissance de Jésus',
    description: 'Jésus naît à Bethléem sous le règne de l\'empereur Auguste et du roi Hérode.',
    date_label: 'env. 5 av. J.-C.',
    year_start: -5,
    year_end: -5,
    era: 'NT',
    refs: 'Luk 2:1',
    category: 'Vie de Jésus',
  },
];
