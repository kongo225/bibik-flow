export interface BookDefinition {
  id: number;
  code: string;
  testament: 'AT' | 'NT';
  chapters_count: number;
  name_fr: string;
  abbr_fr: string;
  name_en: string;
  abbr_en: string;
}

export const BIBLE_BOOKS: BookDefinition[] = [
  // Ancien Testament (1-39)
  { id: 1, code: 'GEN', testament: 'AT', chapters_count: 50, name_fr: 'Genèse', abbr_fr: 'Ge', name_en: 'Genesis', abbr_en: 'Gen' },
  { id: 2, code: 'EXO', testament: 'AT', chapters_count: 40, name_fr: 'Exode', abbr_fr: 'Ex', name_en: 'Exodus', abbr_en: 'Exo' },
  { id: 3, code: 'LEV', testament: 'AT', chapters_count: 27, name_fr: 'Lévitique', abbr_fr: 'Lé', name_en: 'Leviticus', abbr_en: 'Lev' },
  { id: 4, code: 'NUM', testament: 'AT', chapters_count: 36, name_fr: 'Nombres', abbr_fr: 'No', name_en: 'Numbers', abbr_en: 'Num' },
  { id: 5, code: 'DEU', testament: 'AT', chapters_count: 34, name_fr: 'Deutéronome', abbr_fr: 'De', name_en: 'Deuteronomy', abbr_en: 'Deu' },
  { id: 6, code: 'JOS', testament: 'AT', chapters_count: 24, name_fr: 'Josué', abbr_fr: 'Jos', name_en: 'Joshua', abbr_en: 'Josh' },
  { id: 7, code: 'JDG', testament: 'AT', chapters_count: 21, name_fr: 'Juges', abbr_fr: 'Jg', name_en: 'Judges', abbr_en: 'Judg' },
  { id: 8, code: 'RUT', testament: 'AT', chapters_count: 4, name_fr: 'Ruth', abbr_fr: 'Ru', name_en: 'Ruth', abbr_en: 'Ruth' },
  { id: 9, code: '1SA', testament: 'AT', chapters_count: 31, name_fr: '1 Samuel', abbr_fr: '1S', name_en: '1 Samuel', abbr_en: '1Sam' },
  { id: 10, code: '2SA', testament: 'AT', chapters_count: 24, name_fr: '2 Samuel', abbr_fr: '2S', name_en: '2 Samuel', abbr_en: '2Sam' },
  { id: 11, code: '1KI', testament: 'AT', chapters_count: 22, name_fr: '1 Rois', abbr_fr: '1R', name_en: '1 Kings', abbr_en: '1Kgs' },
  { id: 12, code: '2KI', testament: 'AT', chapters_count: 25, name_fr: '2 Rois', abbr_fr: '2R', name_en: '2 Kings', abbr_en: '2Kgs' },
  { id: 13, code: '1CH', testament: 'AT', chapters_count: 29, name_fr: '1 Chroniques', abbr_fr: '1Ch', name_en: '1 Chronicles', abbr_en: '1Chr' },
  { id: 14, code: '2CH', testament: 'AT', chapters_count: 36, name_fr: '2 Chroniques', abbr_fr: '2Ch', name_en: '2 Chronicles', abbr_en: '2Chr' },
  { id: 15, code: 'EZR', testament: 'AT', chapters_count: 10, name_fr: 'Esdras', abbr_fr: 'Esd', name_en: 'Ezra', abbr_en: 'Ezra' },
  { id: 16, code: 'NEH', testament: 'AT', chapters_count: 13, name_fr: 'Néhémie', abbr_fr: 'Né', name_en: 'Nehemiah', abbr_en: 'Neh' },
  { id: 17, code: 'EST', testament: 'AT', chapters_count: 10, name_fr: 'Esther', abbr_fr: 'Est', name_en: 'Esther', abbr_en: 'Esth' },
  { id: 18, code: 'JOB', testament: 'AT', chapters_count: 42, name_fr: 'Job', abbr_fr: 'Job', name_en: 'Job', abbr_en: 'Job' },
  { id: 19, code: 'PSA', testament: 'AT', chapters_count: 150, name_fr: 'Psaumes', abbr_fr: 'Ps', name_en: 'Psalms', abbr_en: 'Psa' },
  { id: 20, code: 'PRO', testament: 'AT', chapters_count: 31, name_fr: 'Proverbes', abbr_fr: 'Pr', name_en: 'Proverbs', abbr_en: 'Pro' },
  { id: 21, code: 'ECC', testament: 'AT', chapters_count: 12, name_fr: 'Ecclésiaste', abbr_fr: 'Ec', name_en: 'Ecclesiastes', abbr_en: 'Ecc' },
  { id: 22, code: 'SNG', testament: 'AT', chapters_count: 8, name_fr: 'Cantique des Cantiques', abbr_fr: 'Ct', name_en: 'Song of Solomon', abbr_en: 'Song' },
  { id: 23, code: 'ISA', testament: 'AT', chapters_count: 66, name_fr: 'Ésaïe', abbr_fr: 'És', name_en: 'Isaiah', abbr_en: 'Isa' },
  { id: 24, code: 'JER', testament: 'AT', chapters_count: 52, name_fr: 'Jérémie', abbr_fr: 'Jér', name_en: 'Jeremiah', abbr_en: 'Jer' },
  { id: 25, code: 'LAM', testament: 'AT', chapters_count: 5, name_fr: 'Lamentations', abbr_fr: 'La', name_en: 'Lamentations', abbr_en: 'Lam' },
  { id: 26, code: 'EZK', testament: 'AT', chapters_count: 48, name_fr: 'Ézéchiel', abbr_fr: 'Éz', name_en: 'Ezekiel', abbr_en: 'Ezek' },
  { id: 27, code: 'DAN', testament: 'AT', chapters_count: 12, name_fr: 'Daniel', abbr_fr: 'Da', name_en: 'Daniel', abbr_en: 'Dan' },
  { id: 28, code: 'HOS', testament: 'AT', chapters_count: 14, name_fr: 'Osée', abbr_fr: 'Os', name_en: 'Hosea', abbr_en: 'Hos' },
  { id: 29, code: 'JOL', testament: 'AT', chapters_count: 3, name_fr: 'Joël', abbr_fr: 'Joël', name_en: 'Joel', abbr_en: 'Joel' },
  { id: 30, code: 'AMO', testament: 'AT', chapters_count: 9, name_fr: 'Amos', abbr_fr: 'Am', name_en: 'Amos', abbr_en: 'Amos' },
  { id: 31, code: 'OBA', testament: 'AT', chapters_count: 1, name_fr: 'Abdias', abbr_fr: 'Ab', name_en: 'Obadiah', abbr_en: 'Obad' },
  { id: 32, code: 'JON', testament: 'AT', chapters_count: 4, name_fr: 'Jonas', abbr_fr: 'Jon', name_en: 'Jonah', abbr_en: 'Jonah' },
  { id: 33, code: 'MIC', testament: 'AT', chapters_count: 7, name_fr: 'Michée', abbr_fr: 'Mi', name_en: 'Micah', abbr_en: 'Mic' },
  { id: 34, code: 'NAM', testament: 'AT', chapters_count: 3, name_fr: 'Nahum', abbr_fr: 'Na', name_en: 'Nahum', abbr_en: 'Nah' },
  { id: 35, code: 'HAB', testament: 'AT', chapters_count: 3, name_fr: 'Habacuc', abbr_fr: 'Ha', name_en: 'Habakkuk', abbr_en: 'Hab' },
  { id: 36, code: 'ZEP', testament: 'AT', chapters_count: 3, name_fr: 'Sophonie', abbr_fr: 'So', name_en: 'Zephaniah', abbr_en: 'Zeph' },
  { id: 37, code: 'HAG', testament: 'AT', chapters_count: 2, name_fr: 'Aggée', abbr_fr: 'Ag', name_en: 'Haggai', abbr_en: 'Hag' },
  { id: 38, code: 'ZEC', testament: 'AT', chapters_count: 14, name_fr: 'Zacharie', abbr_fr: 'Za', name_en: 'Zechariah', abbr_en: 'Zech' },
  { id: 39, code: 'MAL', testament: 'AT', chapters_count: 4, name_fr: 'Malachie', abbr_fr: 'Mal', name_en: 'Malachi', abbr_en: 'Mal' },

  // Nouveau Testament (40-66)
  { id: 40, code: 'MAT', testament: 'NT', chapters_count: 28, name_fr: 'Matthieu', abbr_fr: 'Mt', name_en: 'Matthew', abbr_en: 'Matt' },
  { id: 41, code: 'MRK', testament: 'NT', chapters_count: 16, name_fr: 'Marc', abbr_fr: 'Mc', name_en: 'Mark', abbr_en: 'Mark' },
  { id: 42, code: 'LUK', testament: 'NT', chapters_count: 24, name_fr: 'Luc', abbr_fr: 'Lc', name_en: 'Luke', abbr_en: 'Luke' },
  { id: 43, code: 'JHN', testament: 'NT', chapters_count: 21, name_fr: 'Jean', abbr_fr: 'Jn', name_en: 'John', abbr_en: 'John' },
  { id: 44, code: 'ACT', testament: 'NT', chapters_count: 28, name_fr: 'Actes', abbr_fr: 'Ac', name_en: 'Acts', abbr_en: 'Acts' },
  { id: 45, code: 'ROM', testament: 'NT', chapters_count: 16, name_fr: 'Romains', abbr_fr: 'Rm', name_en: 'Romans', abbr_en: 'Rom' },
  { id: 46, code: '1CO', testament: 'NT', chapters_count: 16, name_fr: '1 Corinthiens', abbr_fr: '1Co', name_en: '1 Corinthians', abbr_en: '1Cor' },
  { id: 47, code: '2CO', testament: 'NT', chapters_count: 13, name_fr: '2 Corinthiens', abbr_fr: '2Co', name_en: '2 Corinthians', abbr_en: '2Cor' },
  { id: 48, code: 'GAL', testament: 'NT', chapters_count: 6, name_fr: 'Galates', abbr_fr: 'Ga', name_en: 'Galatians', abbr_en: 'Gal' },
  { id: 49, code: 'EPH', testament: 'NT', chapters_count: 6, name_fr: 'Éphésiens', abbr_fr: 'Ép', name_en: 'Ephesians', abbr_en: 'Eph' },
  { id: 50, code: 'PHP', testament: 'NT', chapters_count: 4, name_fr: 'Philippiens', abbr_fr: 'Ph', name_en: 'Philippians', abbr_en: 'Phil' },
  { id: 51, code: 'COL', testament: 'NT', chapters_count: 4, name_fr: 'Colossiens', abbr_fr: 'Col', name_en: 'Colossians', abbr_en: 'Col' },
  { id: 52, code: '1TH', testament: 'NT', chapters_count: 5, name_fr: '1 Thessaloniciens', abbr_fr: '1Th', name_en: '1 Thessalonians', abbr_en: '1Thess' },
  { id: 53, code: '2TH', testament: 'NT', chapters_count: 3, name_fr: '2 Thessaloniciens', abbr_fr: '2Th', name_en: '2 Thessalonians', abbr_en: '2Thess' },
  { id: 54, code: '1TI', testament: 'NT', chapters_count: 6, name_fr: '1 Timothée', abbr_fr: '1Ti', name_en: '1 Timothy', abbr_en: '1Tim' },
  { id: 55, code: '2TI', testament: 'NT', chapters_count: 4, name_fr: '2 Timothée', abbr_fr: '2Ti', name_en: '2 Timothy', abbr_en: '2Tim' },
  { id: 56, code: 'TIT', testament: 'NT', chapters_count: 3, name_fr: 'Tite', abbr_fr: 'Tt', name_en: 'Titus', abbr_en: 'Titus' },
  { id: 57, code: 'PHM', testament: 'NT', chapters_count: 1, name_fr: 'Philémon', abbr_fr: 'Phm', name_en: 'Philemon', abbr_en: 'Philm' },
  { id: 58, code: 'HEB', testament: 'NT', chapters_count: 13, name_fr: 'Hébreux', abbr_fr: 'Hé', name_en: 'Hebrews', abbr_en: 'Heb' },
  { id: 59, code: 'JAS', testament: 'NT', chapters_count: 5, name_fr: 'Jacques', abbr_fr: 'Jc', name_en: 'James', abbr_en: 'Jas' },
  { id: 60, code: '1PE', testament: 'NT', chapters_count: 5, name_fr: '1 Pierre', abbr_fr: '1P', name_en: '1 Peter', abbr_en: '1Pet' },
  { id: 61, code: '2PE', testament: 'NT', chapters_count: 3, name_fr: '2 Pierre', abbr_fr: '2P', name_en: '2 Peter', abbr_en: '2Pet' },
  { id: 62, code: '1JN', testament: 'NT', chapters_count: 5, name_fr: '1 Jean', abbr_fr: '1Jn', name_en: '1 John', abbr_en: '1John' },
  { id: 63, code: '2JN', testament: 'NT', chapters_count: 1, name_fr: '2 Jean', abbr_fr: '2Jn', name_en: '2 John', abbr_en: '2John' },
  { id: 64, code: '3JN', testament: 'NT', chapters_count: 1, name_fr: '3 Jean', abbr_fr: '3Jn', name_en: '3 John', abbr_en: '3John' },
  { id: 65, code: 'JUD', testament: 'NT', chapters_count: 1, name_fr: 'Jude', abbr_fr: 'Jude', name_en: 'Jude', abbr_en: 'Jude' },
  { id: 66, code: 'REV', testament: 'NT', chapters_count: 22, name_fr: 'Apocalypse', abbr_fr: 'Ap', name_en: 'Revelation', abbr_en: 'Rev' },
];
