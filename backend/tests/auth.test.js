import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';

describe('Auth API', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0 && process.env.MONGODB_URI) {
      try {
        await connectDatabase();
      } catch (err) {
        console.warn('Test database connection skipped:', err.message);
      }
    }
  }, 10000);

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await disconnectDatabase();
    }
  });

  it('should return 400 when logging in with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('success', false);
  });

  it('should return 400 when registering with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('success', false);
  });

  it('should return 400 when registering with short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: '123' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('success', false);
  });

  it('should return 401 when verifying without token', async () => {
    const res = await request(app).post('/api/auth/verify');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('valid', false);
  });

  it('should return 401 when verifying an invalid token', async () => {
    const res = await request(app)
      .post('/api/auth/verify')
      .set('Authorization', 'Bearer invalidtoken123');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('valid', false);
  });

  it('should return 401 or handle invalid credentials on login', async () => {
    if (mongoose.connection.readyState !== 1) {
      // If DB is not connected in this environment, skip DB-dependent assertion
      return;
    }
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent_test_user@example.com', password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
  }, 10000);
});
