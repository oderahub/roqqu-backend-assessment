import { describe, it, beforeAll, beforeEach, afterAll, expect } from '@jest/globals';
import supertest from 'supertest';
import { AppDataSource } from '../config/database';
import app from '../index';
import { User } from '../entities/user.entity';
import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../constants/error.constants';

describe('Address API', () => {
  let userId: string;
  let token: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // Clear all tables to ensure isolation
    await AppDataSource.query('DELETE FROM posts');
    await AppDataSource.query('DELETE FROM addresses');
    await AppDataSource.query('DELETE FROM users');
    const user = await AppDataSource.getRepository(User).save({
      firstName: 'Address',
      lastName: 'Test',
      email: 'address@test.com',
    });
    userId = user.id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
    await AppDataSource.query('DELETE FROM posts');
    await AppDataSource.query('DELETE FROM addresses');
    await AppDataSource.query('DELETE FROM users');
    await AppDataSource.destroy();
  });

  it('should create an address', async () => {
    const response = await supertest(app)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        zipCode: '12345',
      });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.userId).toBe(userId);
    expect(response.body.data.street).toBe('123 Test St');
  });

  it('should fail to create duplicate address', async () => {
    await supertest(app).post('/addresses').set('Authorization', `Bearer ${token}`).send({
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      zipCode: '12345',
    });
    const response = await supertest(app)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        street: '456 Another St',
        city: 'Another City',
        state: 'Another State',
        country: 'Another Country',
        zipCode: '67890',
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(ERROR_MESSAGES.ADDRESS.ALREADY_EXISTS);
  });

  it('should get address by userId', async () => {
    await supertest(app).post('/addresses').set('Authorization', `Bearer ${token}`).send({
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      zipCode: '12345',
    });
    const response = await supertest(app).get(`/addresses/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.street).toBe('123 Test St');
    expect(response.body.data.userId).toBe(userId);
  });

  it('should fail to get address for non-existent user', async () => {
    const response = await supertest(app).get('/addresses/99999999-9999-9999-9999-999999999999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(ERROR_MESSAGES.ADDRESS.NOT_FOUND);
  });

  it('should update address', async () => {
    await supertest(app).post('/addresses').set('Authorization', `Bearer ${token}`).send({
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      zipCode: '12345',
    });
    const response = await supertest(app)
      .patch(`/addresses/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ city: 'New City', zipCode: '67890' });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.city).toBe('New City');
    expect(response.body.data.zipCode).toBe('67890');
  });

  it('should delete address', async () => {
    await supertest(app).post('/addresses').set('Authorization', `Bearer ${token}`).send({
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      zipCode: '12345',
    });
    const response = await supertest(app)
      .delete(`/addresses/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
  });
});
