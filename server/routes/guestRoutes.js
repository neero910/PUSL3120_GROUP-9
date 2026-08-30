/**
 * Guests Routes
 */

import express from 'express';
import {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuestData,
  deleteGuestData,
  getGuestStats
} from '../controllers/guestController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllGuests);
router.get('/stats/summary', getGuestStats);
router.get('/:id', getGuestById);

// Protected routes - Receptionist and above can create/update/delete
router.post('/', authenticate, authorizeRoles('Administrator', 'Manager', 'Receptionist'), createGuest);
router.put('/:id', authenticate, authorizeRoles('Administrator', 'Manager', 'Receptionist'), updateGuestData);
router.delete('/:id', authenticate, authorizeRoles('Administrator', 'Manager'), deleteGuestData);

export default router;
