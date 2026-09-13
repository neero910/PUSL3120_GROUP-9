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

import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import { generateToken, authenticate, authorizeRoles, JWT_SECRET } from '../middleware/authMiddleware.js';

describe('Auth Middleware & Token Unit Tests', () => {
  const mockUser = {
    id: 'user_123456',
    email: 'admin@hotel.com',
    name: 'Admin User',
    role: 'Administrator'
  };

  it('generateToken should generate a valid signed JWT', () => {
    const token = generateToken(mockUser);
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, JWT_SECRET());
    expect(decoded.id).toBe(mockUser.id);
    expect(decoded.email).toBe(mockUser.email);
    expect(decoded.role).toBe(mockUser.role);
    expect(decoded).toHaveProperty('exp');
  });

  describe('authenticate middleware', () => {
    it('should reject requests without authorization header with 401', () => {
      const req = { headers: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject requests with malformed authorization header with 401', () => {
      const req = { headers: { authorization: 'Basic 12345' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should accept requests with valid Bearer token and attach req.user', () => {
      const token = generateToken(mockUser);
      const req = { headers: { authorization: `Bearer ${token}` } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      authenticate(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.email).toBe(mockUser.email);
      expect(req.user.role).toBe(mockUser.role);
    });
  });

  describe('authorizeRoles RBAC middleware', () => {
    it('should return 401 if user is not attached to request', () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      const middleware = authorizeRoles('Administrator', 'Manager');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 Forbidden if user role is not permitted', () => {
      const req = { user: { role: 'Housekeeper' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      const middleware = authorizeRoles('Administrator', 'Manager');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('Forbidden')
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if user role is in permitted list', () => {
      const req = { user: { role: 'Manager' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      const middleware = authorizeRoles('Administrator', 'Manager');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
