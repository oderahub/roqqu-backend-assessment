import { DataSource } from 'typeorm';
import path from 'path';
import { User } from '../entities/user.entity';
import { Address } from '../entities/address.entity';
import { Post } from '../entities/post.entity';
import 'reflect-metadata';
import dotenv from 'dotenv';
import { logger as log } from '../utils/logger';

dotenv.config();

const dbPath = process.env.DATABASE_PATH || 'database.sqlite';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.resolve(process.cwd(), dbPath),
  entities: [User, Address, Post],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  migrations: ['src/migrations/**/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    log.info('Database has been initialized');
  } catch (error) {
    log.error('Error during database initialization:', error);
    throw error;
  }
};
