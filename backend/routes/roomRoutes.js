/**
 * Rooms Routes
 */

import express from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoomData,
  deleteRoomData,
  getRoomStats
} from '../controllers/roomController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.get('/', getAllRooms);
router.get('/stats/summary', getRoomStats);
router.get('/:id', getRoomById);

// Protected routes - only Administrator and Manager can create/update/delete
router.post('/', authenticate, authorizeRoles('Administrator', 'Manager'), createRoom);
router.put('/:id', authenticate, authorizeRoles('Administrator', 'Manager'), updateRoomData);
router.delete('/:id', authenticate, authorizeRoles('Administrator', 'Manager'), deleteRoomData);

export default router;
