import { searchRepository, SearchResult, StrongEntry } from '../data/repositories/searchRepository';

export const searchService = {
  searchVerses(query: string, versionId = 'lsg', testament: 'ALL' | 'AT' | 'NT' = 'ALL', language = 'fr'): Promise<SearchResult[]> {
    return searchRepository.searchVerses(query, versionId, testament, language);
  },

  parseReference(query: string, language = 'fr') {
    return searchRepository.parseReference(query, language);
  },

  getStrongEntry(strongId: string): Promise<StrongEntry | null> {
    return searchRepository.getStrongEntry(strongId);
  },

  getStrongOccurrences(strongId: string, language = 'fr'): Promise<SearchResult[]> {
    return searchRepository.getStrongOccurrences(strongId, language);
  },
};
