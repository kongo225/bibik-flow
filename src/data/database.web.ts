import { seedDatabase } from './seedDatabase';

export const getDatabase = async (): Promise<any> => {
  return {
    execAsync: async () => {},
    runAsync: async () => {},
    getAllAsync: async () => [],
    getFirstAsync: async () => null,
  };
};

export const initDatabase = async (): Promise<void> => {
  console.log('Web environment detected: SQLite native database bypassed.');
};
