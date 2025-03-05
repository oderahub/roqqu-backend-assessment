import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import supertest from 'supertest';
import { AppDataSource } from '../config/database';
import app from '../index';
import { User } from '../entities/user.entity';
import jwt from 'jsonwebtoken';
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

    // Create User 1 (John)
    const user1 = await AppDataSource.getRepository(User).save({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    });
    userId1 = user1.id;
    token1 = jwt.sign({ id: userId1 }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '1h',
    });

    // Create User 2 (Jane)
    const user2 = await AppDataSource.getRepository(User).save({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
    });
    userId2 = user2.id;
    token2 = jwt.sign({ id: userId2 }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
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
