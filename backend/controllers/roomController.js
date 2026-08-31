/**
 * Rooms Controller
 * Handles CRUD operations and statistics for rooms
 */

import { rooms, addRoom, findRoomById, findRoomByNumber, updateRoom, deleteRoom } from '../data/rooms.js';

/**
 * Get all rooms (with optional query filters)
 * GET /api/rooms
 */
export function getAllRooms(req, res, next) {
  try {
    const { search, type, status, housekeepingStatus, floor } = req.query;

    let filtered = [...rooms];

    if (search) {
      const q = String(search).trim().toLowerCase();
      filtered = filtered.filter(r =>
        r.roomNumber.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        (r.currentGuest && r.currentGuest.toLowerCase().includes(q)) ||
        (r.view && r.view.toLowerCase().includes(q)) ||
        (Array.isArray(r.amenities) && r.amenities.some(a => a.toLowerCase().includes(q))) ||
        (r.notes && r.notes.toLowerCase().includes(q))
      );
    }

    if (type && type !== 'All') {
      filtered = filtered.filter(r => r.type.toLowerCase() === String(type).toLowerCase());
    }

    if (status && status !== 'All') {
      filtered = filtered.filter(r => r.status.toLowerCase() === String(status).toLowerCase());
    }

    if (housekeepingStatus && housekeepingStatus !== 'All') {
      filtered = filtered.filter(r => r.housekeepingStatus.toLowerCase() === String(housekeepingStatus).toLowerCase());
    }

    if (floor && floor !== 'All' && floor !== 'All Floors') {
      const floorNum = parseInt(String(floor).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(floorNum)) {
        filtered = filtered.filter(r => r.floor === floorNum);
      }
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single room by ID or roomNumber
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
    const {
      roomNumber,
      type,
      capacity,
      price,
      status,
      housekeepingStatus,
      description,
      amenities,
      floor,
      bedType,
      view,
      assignedAttendant,
      notes,
      currentGuest
    } = req.body;

    // Validation
    if (!roomNumber || !type || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: 'Room number, type, and price are required'
      });
    }

    // Check if room number already exists
    const existing = findRoomByNumber(roomNumber);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Room number ${roomNumber} already exists`
      });
    }

    const newRoom = addRoom({
      roomNumber: String(roomNumber).trim(),
      type,
      capacity: capacity ? parseInt(capacity, 10) : 2,
      price: parseInt(price, 10),
      status: status || 'Available',
      housekeepingStatus: housekeepingStatus || (status === 'Cleaning' ? 'In Progress' : status === 'Maintenance' ? 'Out of Order' : 'Clean & Ready'),
      description: description || '',
      amenities: Array.isArray(amenities) ? amenities : ['Free WiFi', 'Air Conditioning'],
      floor: floor ? parseInt(floor, 10) : (parseInt(String(roomNumber)[0], 10) || 1),
      bedType: bedType || 'Queen Bed',
      view: view || 'Garden View',
      assignedAttendant: assignedAttendant || 'Kamani Silva',
      notes: notes || '',
      currentGuest: currentGuest || null,
      lastCleaned: 'Just now'
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
 * PUT/PATCH /api/rooms/:id
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

    const {
      roomNumber,
      type,
      capacity,
      price,
      status,
      housekeepingStatus,
      description,
      amenities,
      floor,
      bedType,
      view,
      assignedAttendant,
      notes,
      currentGuest,
      lastCleaned
    } = req.body;

    // Validate room number uniqueness if changed
    if (roomNumber && String(roomNumber).trim() !== String(room.roomNumber)) {
      const existing = findRoomByNumber(roomNumber);
      if (existing && String(existing.id) !== String(room.id)) {
        return res.status(400).json({
          success: false,
          message: `Room number ${roomNumber} already exists`
        });
      }
    }

    const updates = {};
    if (roomNumber !== undefined) updates.roomNumber = String(roomNumber).trim();
    if (type !== undefined) updates.type = type;
    if (capacity !== undefined) updates.capacity = parseInt(capacity, 10);
    if (price !== undefined) updates.price = parseInt(price, 10);
    if (status !== undefined) updates.status = status;
    if (housekeepingStatus !== undefined) updates.housekeepingStatus = housekeepingStatus;
    if (description !== undefined) updates.description = description;
    if (amenities !== undefined) updates.amenities = Array.isArray(amenities) ? amenities : [];
    if (floor !== undefined) updates.floor = parseInt(floor, 10);
    if (bedType !== undefined) updates.bedType = bedType;
    if (view !== undefined) updates.view = view;
    if (assignedAttendant !== undefined) updates.assignedAttendant = assignedAttendant;
    if (notes !== undefined) updates.notes = notes;
    if (currentGuest !== undefined) updates.currentGuest = currentGuest;
    if (lastCleaned !== undefined) updates.lastCleaned = lastCleaned;

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
 * Quick status update
 * PATCH /api/rooms/:id/status
 */
export function updateRoomStatus(req, res, next) {
  try {
    const room = findRoomById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const { status, housekeepingStatus } = req.body;

    if (!status && !housekeepingStatus) {
      return res.status(400).json({
        success: false,
        message: 'Status or housekeepingStatus is required'
      });
    }

    const updates = {};
    if (status) {
      updates.status = status;
      if (!housekeepingStatus) {
        if (status === 'Cleaning') updates.housekeepingStatus = 'In Progress';
        else if (status === 'Available') updates.housekeepingStatus = 'Clean & Ready';
        else if (status === 'Maintenance') updates.housekeepingStatus = 'Out of Order';
      }
    }

    if (housekeepingStatus) {
      updates.housekeepingStatus = housekeepingStatus;
      if (!status) {
        if (housekeepingStatus === 'In Progress') updates.status = 'Cleaning';
        else if (housekeepingStatus === 'Clean & Ready' && room.status === 'Cleaning') updates.status = 'Available';
        else if (housekeepingStatus === 'Out of Order') updates.status = 'Maintenance';
      }
    }

    const updatedRoom = updateRoom(req.params.id, updates);

    res.json({
      success: true,
      message: `Room status updated to ${updatedRoom.status}`,
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
    const reservedRooms = rooms.filter(r => r.status === 'Reserved').length;
    const cleaningRooms = rooms.filter(r => r.status === 'Cleaning').length;
    const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance').length;
    const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(2) : '0.00';

    res.json({
      success: true,
      data: {
        totalRooms,
        availableRooms,
        occupiedRooms,
        reservedRooms,
        cleaningRooms,
        maintenanceRooms,
        occupancyRate: `${occupancyRate}%`
      }
    });
  } catch (error) {
    next(error);
  }
}
