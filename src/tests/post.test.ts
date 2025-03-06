import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import supertest from 'supertest';
import { AppDataSource } from '../config/database';
import app from '../index';
import { ERROR_MESSAGES } from '../constants/error.constants';

describe('Post API', () => {
  let userId1: string; // John
  let userId2: string; // Jane
  let token1: string; // John's token
  let token2: string; // Jane's token
  let postId1: string; // John's post
  let postId2: string; // Jane's post

  beforeAll(async () => {
    await AppDataSource.initialize();
    // Clear all tables for isolation
    await AppDataSource.query('DELETE FROM posts');
    await AppDataSource.query('DELETE FROM addresses');
    await AppDataSource.query('DELETE FROM users');

    // Create User 1 (John) via API
    const createJohn = await supertest(app).post('/users').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    });
    expect(createJohn.status).toBe(201);
    userId1 = createJohn.body.data.id;
    console.log('John created:', userId1); // Debug

    // Login John
    const loginJohn = await supertest(app)
      .post('/auth/login')
      .send({ email: 'john.doe@example.com' });
    expect(loginJohn.status).toBe(200);
    token1 = loginJohn.body.data.token;
    console.log('John token:', token1); // Debug

    // Create User 2 (Jane) via API
    const createJane = await supertest(app).post('/users').send({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
    });
    expect(createJane.status).toBe(201);
    userId2 = createJane.body.data.id;
    console.log('Jane created:', userId2); // Debug

    // Login Jane
    const loginJane = await supertest(app)
      .post('/auth/login')
      .send({ email: 'jane.smith@example.com' });
    expect(loginJane.status).toBe(200);
    token2 = loginJane.body.data.token;
    console.log('Jane token:', token2); // Debug
  });

  afterAll(async () => {
    // Clear all tables
    await AppDataSource.query('DELETE FROM posts');
    await AppDataSource.query('DELETE FROM addresses');
    await AppDataSource.query('DELETE FROM users');
    await AppDataSource.destroy();
  });

  it('should create a post for John', async () => {
    const response = await supertest(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        title: "John's Post",
        body: "This is John's first post content.",
      });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.userId).toBe(userId1);
    postId1 = response.body.data.id;
    console.log('John post ID:', postId1); // Debug
  });

  it('should create a post for Jane', async () => {
    const response = await supertest(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        title: "Jane's Post",
        body: "This is Jane's first post content.",
      });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.userId).toBe(userId2);
    postId2 = response.body.data.id;
    console.log('Jane post ID:', postId2); // Debug
  });

  it('should fail to create post without authentication', async () => {
    const response = await supertest(app).post('/posts').send({
      title: 'No Auth Post',
      body: 'This should fail.',
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(ERROR_MESSAGES.SERVER.UNAUTHORIZED);
  });

  it('should get posts by userId (John)', async () => {
    const response = await supertest(app).get(`/posts?userId=${userId1}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].userId).toBe(userId1);
  });

  it("should get post by ID (John's post)", async () => {
    const response = await supertest(app).get(`/posts/${postId1}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.id).toBe(postId1);
    expect(response.body.data.title).toBe("John's Post");
  });

  it('should fail to get non-existent post', async () => {
    const response = await supertest(app).get('/posts/99999999-9999-9999-9999-999999999999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(ERROR_MESSAGES.POST.NOT_FOUND);
  });

  it("should update John's post", async () => {
    const response = await supertest(app)
      .patch(`/posts/${postId1}`)
      .set('Authorization', `Bearer ${token1}`)
      .send({
        body: "Updated: John's revised post content.",
      });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.body).toBe("Updated: John's revised post content.");
  });

  it("should fail to delete Jane's post with John's token", async () => {
    const response = await supertest(app)
      .delete(`/posts/${postId2}`)
      .set('Authorization', `Bearer ${token1}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(ERROR_MESSAGES.SERVER.UNAUTHORIZED);
  });

  it("should delete John's post", async () => {
    const response = await supertest(app)
      .delete(`/posts/${postId1}`)
      .set('Authorization', `Bearer ${token1}`);
    expect(response.status).toBe(204);
  });

  it("should delete Jane's post", async () => {
    const response = await supertest(app)
      .delete(`/posts/${postId2}`)
      .set('Authorization', `Bearer ${token2}`);
    expect(response.status).toBe(204);
  });
});
