/**
 * Rooms Controller
 * Handles CRUD operations for rooms
 */

import { rooms, addRoom, findRoomById, updateRoom, deleteRoom } from '../data/rooms.js';

/**
 * Get all rooms
 * GET /api/rooms
 */
export function getAllRooms(req, res, next) {
  try {
    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single room by ID
 * GET /api/rooms/:id
 */
export function getRoomById(req, res, next) {
  try {
    const room = findRoomById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create new room
 * POST /api/rooms
 */
export function createRoom(req, res, next) {
  try {
    const { roomNumber, type, capacity, price, status, description, amenities, floor } = req.body;

    // Validation
    if (!roomNumber || !type || !capacity || !price) {
      return res.status(400).json({
        success: false,
        message: 'Room number, type, capacity, and price are required'
      });
    }

    // Check if room number already exists
    if (rooms.some(r => r.roomNumber === roomNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Room number already exists'
      });
    }

    const newRoom = addRoom({
      roomNumber,
      type,
      capacity: parseInt(capacity),
      price: parseInt(price),
      status: status || 'Available',
      description: description || '',
      amenities: amenities || [],
      floor: floor || 1
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: newRoom
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update room
 * PUT /api/rooms/:id
 */
export function updateRoomData(req, res, next) {
  try {
    const room = findRoomById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const { roomNumber, type, capacity, price, status, description, amenities, floor } = req.body;

    // Validate room number uniqueness if changed
    if (roomNumber && roomNumber !== room.roomNumber) {
      if (rooms.some(r => r.roomNumber === roomNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Room number already exists'
        });
      }
    }

    const updates = {};
    if (roomNumber !== undefined) updates.roomNumber = roomNumber;
    if (type !== undefined) updates.type = type;
    if (capacity !== undefined) updates.capacity = parseInt(capacity);
    if (price !== undefined) updates.price = parseInt(price);
    if (status !== undefined) updates.status = status;
    if (description !== undefined) updates.description = description;
    if (amenities !== undefined) updates.amenities = amenities;
    if (floor !== undefined) updates.floor = floor;

    const updatedRoom = updateRoom(req.params.id, updates);

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: updatedRoom
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete room
 * DELETE /api/rooms/:id
 */
export function deleteRoomData(req, res, next) {
  try {
    const deletedRoom = deleteRoom(req.params.id);
    
    if (!deletedRoom) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      message: 'Room deleted successfully',
      data: deletedRoom
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get room statistics
 * GET /api/rooms/stats/summary
 */
export function getRoomStats(req, res, next) {
  try {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'Available').length;
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
    const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance').length;
    const reservedRooms = totalRooms - availableRooms - occupiedRooms - maintenanceRooms;

    res.json({
      success: true,
      data: {
        totalRooms,
        availableRooms,
        occupiedRooms,
        reservedRooms,
        maintenanceRooms,
        occupancyRate: ((occupiedRooms / totalRooms) * 100).toFixed(2)
      }
    });
  } catch (error) {
    next(error);
  }
}
