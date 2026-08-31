/**
 * Rooms Routes
 */

import express from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoomData,
  updateRoomStatus,
  deleteRoomData,
  getRoomStats
} from '../controllers/roomController.js';

const router = express.Router();

// Summary statistics
router.get('/stats/summary', getRoomStats);

// List all rooms & filter
router.get('/', getAllRooms);

// Single room details
router.get('/:id', getRoomById);

// Create room
router.post('/', createRoom);

// Full or partial room update
router.put('/:id', updateRoomData);
router.patch('/:id', updateRoomData);

// Quick status change
router.patch('/:id/status', updateRoomStatus);

// Delete room
router.delete('/:id', deleteRoomData);

export default router;
