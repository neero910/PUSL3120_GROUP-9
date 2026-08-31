/**
 * Dashboard Routes
 */

import express from 'express';
import {
  getDashboardSummary,
  getOccupancyData,
  getRevenueData
} from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All dashboard endpoints require authentication
router.get('/summary', authenticate, getDashboardSummary);
router.get('/occupancy', authenticate, getOccupancyData);
router.get('/revenue', authenticate, getRevenueData);

export default router;
