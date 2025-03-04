import { DataSource } from 'typeorm';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || 'database.sqlite';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.resolve(process.cwd(), dbPath),
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database has been initialized');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
};
