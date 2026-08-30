/**
 * Authentication Routes
 */

import express from 'express';
import { register, login, getCurrentUser, verifyToken } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyToken);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router;
