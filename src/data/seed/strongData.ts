export interface StrongEntrySeed {
  strong_id: string;
  original: string;
  transliteration: string;
  pronunciation: string;
  definition_fr: string;
  usage_fr: string;
}

export const STRONG_LEXICON_SAMPLE: StrongEntrySeed[] = [
  {
    strong_id: 'G2316',
    original: 'θεός',
    transliteration: 'theos',
    pronunciation: 'the-os',
    definition_fr: 'Dieu, la Divinité suprême, le Créateur et Souverain de l\'univers.',
    usage_fr: 'Utilisé 1318 fois dans le Nouveau Testament pour désigner le seul vrai Dieu.',
  },
  {
    strong_id: 'G026',
    original: 'ἀγάπη',
    transliteration: 'agape',
    pronunciation: 'ah-gah-pay',
    definition_fr: 'Amour inconditionnel, bienveillance, affection spirituelle et désintéressée.',
    usage_fr: 'Amour divin révélé en Jésus-Christ et manifesté envers les hommes.',
  },
  {
    strong_id: 'G5485',
    original: 'χάρις',
    transliteration: 'charis',
    pronunciation: 'khas-ece',
    definition_fr: 'Grâce, faveur imméritée, bienveillance divine, don gratuit.',
    usage_fr: 'La faveur imméritée de Dieu envers les pécheurs par le Christ.',
  },
  {
    strong_id: 'H430',
    original: 'אֱלֹהִים',
    transliteration: 'Elohim',
    pronunciation: 'el-o-heem',
    definition_fr: 'Dieu, les dieux, Juges, Anges. Pluriel de majesté pour le Dieu d\'Israël.',
    usage_fr: 'Utilisé plus de 2500 fois dans l\'Ancien Testament pour le Dieu Créateur.',
  },
  {
    strong_id: 'H2617',
    original: 'חֶסֶד',
    transliteration: 'chesed',
    pronunciation: 'kheh-sed',
    definition_fr: 'Bonté, amour fidèle, miséricorde, loyauté envers l\'alliance.',
    usage_fr: 'L\'amour fidèle et indéfectible de Dieu envers son peuple.',
  },
];

export interface VerseWordSeed {
  version_id: string;
  book_id: number;
  chapter: number;
  verse: number;
  position: number;
  word: string;
  strong_id: string;
}

export const VERSE_WORDS_SAMPLE: VerseWordSeed[] = [
  { version_id: 'lsg', book_id: 1, chapter: 1, verse: 1, position: 1, word: 'Dieu', strong_id: 'H430' },
  { version_id: 'lsg', book_id: 43, chapter: 1, verse: 1, position: 1, word: 'Dieu', strong_id: 'G2316' },
  { version_id: 'lsg', book_id: 43, chapter: 3, verse: 16, position: 1, word: 'Dieu', strong_id: 'G2316' },
  { version_id: 'lsg', book_id: 43, chapter: 3, verse: 16, position: 2, word: 'aimé', strong_id: 'G026' },
  { version_id: 'lsg', book_id: 66, chapter: 22, verse: 21, position: 1, word: 'grâce', strong_id: 'G5485' },
];
