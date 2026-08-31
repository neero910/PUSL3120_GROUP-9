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
  getReservationStats,
  filterByStatus,
  filterByDateRange,
  searchReservationsHandler,
  getFilteredReservations,
  getReservationStatsByStatus,
  checkRoomAvailability
} from '../controllers/reservationController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Statistics routes (must be before :id routes)
router.get('/stats/summary', getReservationStats);
router.get('/stats/by-status', getReservationStatsByStatus);

// Filter routes
router.get('/filter/status', filterByStatus);
router.get('/filter/date-range', filterByDateRange);

// Search route
router.get('/search', searchReservationsHandler);

// Advanced filtering with pagination
router.get('/filtered', getFilteredReservations);

// Availability check
router.get('/availability/room/:roomId', checkRoomAvailability);

// Get all reservations
router.get('/', getAllReservations);

// Get reservations by guest
router.get('/guest/:guestId', getReservationsByGuest);

// Get single reservation by ID
router.get('/:id', getReservationById);

// Protected routes - Create
router.post('/', authenticate, authorizeRoles('Administrator', 'Manager', 'Receptionist'), createReservation);

// Protected routes - Update
router.put('/:id', authenticate, authorizeRoles('Administrator', 'Manager', 'Receptionist'), updateReservationData);

// Protected routes - Delete
router.delete('/:id', authenticate, authorizeRoles('Administrator', 'Manager'), deleteReservationData);

export default router;
