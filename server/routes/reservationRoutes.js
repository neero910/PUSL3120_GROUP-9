/**
 * Reservations Routes
 */

import express from 'express';
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservationData,
  deleteReservationData,
  getReservationsByGuest,
  getReservationStats
} from '../controllers/reservationController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllReservations);
router.get('/stats/summary', getReservationStats);
router.get('/:id', getReservationById);
router.get('/guest/:guestId', getReservationsByGuest);

// Protected routes
router.post('/', authenticate, authorizeRoles('Administrator', 'Manager', 'Receptionist'), createReservation);
router.put('/:id', authenticate, authorizeRoles('Administrator', 'Manager', 'Receptionist'), updateReservationData);
router.delete('/:id', authenticate, authorizeRoles('Administrator', 'Manager'), deleteReservationData);

export default router;
