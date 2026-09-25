import { getDatabase } from '../data/database';
import { BibleVersion } from '../data/repositories/bibleRepository';

export interface RemoteVersionPackage {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
  license: string;
  size_mb: number;
  download_url: string;
}

export const AVAILABLE_PACKAGES: RemoteVersionPackage[] = [
  {
    id: 's21',
    name: 'Segond 21',
    abbreviation: 'S21',
    language: 'fr',
    license: 'Société Biblique de Genève',
    size_mb: 4.8,
    download_url: 'https://example.com/s21.json',
  },
  {
    id: 'bds',
    name: 'Bible du Semeur',
    abbreviation: 'BDS',
    language: 'fr',
    license: 'Biblica',
    size_mb: 5.1,
    download_url: 'https://example.com/bds.json',
  },
  {
    id: 'kjv',
    name: 'King James Version',
    abbreviation: 'KJV',
    language: 'en',
    license: 'Domaine Public',
    size_mb: 4.6,
    download_url: 'https://example.com/kjv.json',
  },
];

export const downloadService = {
  async getInstalledVersions(): Promise<BibleVersion[]> {
    const db = await getDatabase();
    return db.getAllAsync('SELECT * FROM versions;') as Promise<BibleVersion[]>;
  },

  async downloadVersionPackage(packageItem: RemoteVersionPackage): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT OR REPLACE INTO versions (id, name, abbreviation, language, license, size_mb, is_downloaded, has_strong)
       VALUES (?, ?, ?, ?, ?, ?, 1, 0);`,
      [
        packageItem.id,
        packageItem.name,
        packageItem.abbreviation,
        packageItem.language,
        packageItem.license,
        packageItem.size_mb,
      ]
    );
  },

  async deleteVersionPackage(versionId: string): Promise<void> {
    if (versionId === 'lsg') return; // Cannot delete primary default version
    const db = await getDatabase();
    await db.runAsync(`DELETE FROM verses WHERE version_id = ?;`, [versionId]);
    await db.runAsync(`DELETE FROM versions WHERE id = ?;`, [versionId]);
  },
};
