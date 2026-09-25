export interface VerseSeed {
  version_id: string;
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
}

export const SAMPLE_VERSES: VerseSeed[] = [
  // LSG - Genèse 1
  { version_id: 'lsg', book_id: 1, chapter: 1, verse: 1, text: "Au commencement, Dieu créa les cieux et la terre." },
  { version_id: 'lsg', book_id: 1, chapter: 1, verse: 2, text: "La terre était informe et vide; il y avait des ténèbres à la surface de l'abîme, et l'esprit de Dieu se mouvait au-dessus des eaux." },
  { version_id: 'lsg', book_id: 1, chapter: 1, verse: 3, text: "Dieu dit: Que la lumière soit! Et la lumière fut." },
  { version_id: 'lsg', book_id: 1, chapter: 1, verse: 4, text: "Dieu vit que la lumière était bonne; et Dieu sépara la lumière d'avec les ténèbres." },
  { version_id: 'lsg', book_id: 1, chapter: 1, verse: 5, text: "Dieu appela la lumière jour, et il appela les ténèbres nuit. Ainsi, il y eut un soir, et il y eut un matin: ce fut le premier jour." },

  // Darby - Genèse 1
  { version_id: 'darby', book_id: 1, chapter: 1, verse: 1, text: "Au commencement Dieu créa les cieux et la terre." },
  { version_id: 'darby', book_id: 1, chapter: 1, verse: 2, text: "Et la terre était désolation et vide, et il y avait des ténèbres sur la face de l'abîme; et l'Esprit de Dieu planait sur la face des eaux." },
  { version_id: 'darby', book_id: 1, chapter: 1, verse: 3, text: "Et Dieu dit: Que la lumière soit. Et la lumière fut." },
  { version_id: 'darby', book_id: 1, chapter: 1, verse: 4, text: "Et Dieu vit la lumière, qu'elle était bonne; et Dieu sépara la lumière d'avec les ténèbres." },
  { version_id: 'darby', book_id: 1, chapter: 1, verse: 5, text: "Et Dieu appela la lumière Jour, et les ténèbres il les appela Nuit. Et il y eut un soir, et il y eut un matin: premier jour." },

  // LSG - Jean 1
  { version_id: 'lsg', book_id: 43, chapter: 1, verse: 1, text: "Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu." },
  { version_id: 'lsg', book_id: 43, chapter: 1, verse: 2, text: "Elle était au commencement avec Dieu." },
  { version_id: 'lsg', book_id: 43, chapter: 1, verse: 3, text: "Toutes choses ont été faites par elle, et rien de ce qui a été fait n'a été fait sans elle." },
  { version_id: 'lsg', book_id: 43, chapter: 1, verse: 4, text: "En elle était la vie, et la vie était la lumière des hommes." },

  // Darby - Jean 1
  { version_id: 'darby', book_id: 43, chapter: 1, verse: 1, text: "Au commencement était la Parole, et la Parole était auprès de Dieu, et la Parole était Dieu." },
  { version_id: 'darby', book_id: 43, chapter: 1, verse: 2, text: "Elle était au commencement auprès de Dieu." },
  { version_id: 'darby', book_id: 43, chapter: 1, verse: 3, text: "Toutes choses ont été faites par elle, et sans elle pas une seule chose n'a été faite de ce qui a été fait." },

  // LSG - Jean 3
  { version_id: 'lsg', book_id: 43, chapter: 3, verse: 16, text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle." },

  // Darby - Jean 3
  { version_id: 'darby', book_id: 43, chapter: 3, verse: 16, text: "Car Dieu a tant aimé le monde, qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse pas, mais qu'il ait la vie éternelle." },

  // LSG - Apocalypse 22
  { version_id: 'lsg', book_id: 66, chapter: 22, verse: 20, text: "Celui qui atteste ces choses dit: Oui, je viens bientôt. Amen! Viens, Seigneur Jésus!" },
  { version_id: 'lsg', book_id: 66, chapter: 22, verse: 21, text: "Que la grâce du Seigneur Jésus soit avec tous!" },

  // Darby - Apocalypse 22
  { version_id: 'darby', book_id: 66, chapter: 22, verse: 20, text: "Celui qui rend témoignage de ces choses dit: Oui, je viens rapidement. Amen; viens, Seigneur Jésus!" },
  { version_id: 'darby', book_id: 66, chapter: 22, verse: 21, text: "Que la grâce du Seigneur Jésus Christ soit avec tous les saints." },
];
