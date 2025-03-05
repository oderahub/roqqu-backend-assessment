import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import supertest from 'supertest';
import { AppDataSource } from '../config/database';
import app from '../index';
import { User } from '../entities/user.entity';
import { ERROR_MESSAGES } from '../constants/error.constants';

describe('Auth API', () => {
  let userId: string; // eslint-disable-line

  beforeAll(async () => {
    await AppDataSource.initialize();
    const user = await AppDataSource.getRepository(User).save({
      firstName: 'Auth',
      lastName: 'User',
      email: 'auth@test.com',
    });
    userId = user.id;
  });

  afterAll(async () => {
    // Clear all tables and destroy connection
    await AppDataSource.query('DELETE FROM posts');
    await AppDataSource.query('DELETE FROM addresses');
    await AppDataSource.query('DELETE FROM users');
    await AppDataSource.destroy();
  });

  it('should login and return a token', async () => {
    const response = await supertest(app).post('/auth/login').send({
      email: 'auth@test.com',
    });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toHaveProperty('token');
  });

  it('should fail to login with non-existent email', async () => {
    const response = await supertest(app).post('/auth/login').send({
      email: 'nonexistent@test.com',
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(ERROR_MESSAGES.USER.NOT_FOUND);
  });
});
