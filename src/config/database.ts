import { DataSource } from 'typeorm';
import path from 'path';
import { User } from '../entities/user.entity';
import { Address } from '../entities/address.entity';
import { Post } from '../entities/post.entity';

const dbPath = process.env.DATABASE_PATH || 'database.sqlite';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.resolve(process.cwd(), dbPath),
  entities: [User, Address, Post],
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
