/**
 * Reservations Controller
 * Handles CRUD operations for reservations
 */

import { 
  reservations, 
  addReservation, 
  findReservationById, 
  findReservationsByGuestId,
  findConflictingReservations,
  updateReservation, 
  deleteReservation 
} from '../data/reservations.js';
import { findGuestById } from '../data/guests.js';
import { findRoomById } from '../data/rooms.js';

/**
 * Get all reservations
 * GET /api/reservations
 */
export function getAllReservations(req, res, next) {
  try {
    res.json({
      success: true,
      data: reservations
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single reservation by ID
 * GET /api/reservations/:id
 */
export function getReservationById(req, res, next) {
  try {
    const reservation = findReservationById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create new reservation
 * POST /api/reservations
 */
export function createReservation(req, res, next) {
  try {
    const { guestId, roomId, checkInDate, checkOutDate, adults, children, status, specialRequests } = req.body;

    // Validation
    if (!guestId || !roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Guest ID, Room ID, check-in date, and check-out date are required'
      });
    }

    // Verify guest exists
    const guest = findGuestById(guestId);
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    // Verify room exists
    const room = findRoomById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Validate dates
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    if (outDate <= inDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Check for double-booking
    const conflicts = findConflictingReservations(roomId, checkInDate, checkOutDate);
    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Room is already reserved for the selected dates'
      });
    }

    // Calculate total amount
    const daysCount = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
    const totalAmount = room.price * daysCount;

    const newReservation = addReservation({
      guestId,
      roomId,
      checkInDate,
      checkOutDate,
      adults: parseInt(adults) || 1,
      children: parseInt(children) || 0,
      status: status || 'Pending',
      totalAmount,
      specialRequests: specialRequests || ''
    });

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: newReservation
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update reservation
 * PUT /api/reservations/:id
 */
export function updateReservationData(req, res, next) {
  try {
    const reservation = findReservationById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    const { checkInDate, checkOutDate, adults, children, status, specialRequests } = req.body;

    // Validate dates if changed
    if (checkInDate || checkOutDate) {
      const inDate = new Date(checkInDate || reservation.checkInDate);
      const outDate = new Date(checkOutDate || reservation.checkOutDate);
      if (outDate <= inDate) {
        return res.status(400).json({
          success: false,
          message: 'Check-out date must be after check-in date'
        });
      }

      // Check for conflicts with updated dates
      const conflicts = findConflictingReservations(
        reservation.roomId, 
        checkInDate || reservation.checkInDate, 
        checkOutDate || reservation.checkOutDate
      ).filter(r => r.id !== reservation.id);
      
      if (conflicts.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Room is already reserved for the selected dates'
        });
      }
    }

    const updates = {};
    if (checkInDate !== undefined) updates.checkInDate = checkInDate;
    if (checkOutDate !== undefined) updates.checkOutDate = checkOutDate;
    if (adults !== undefined) updates.adults = parseInt(adults);
    if (children !== undefined) updates.children = parseInt(children);
    if (status !== undefined) updates.status = status;
    if (specialRequests !== undefined) updates.specialRequests = specialRequests;

    // Recalculate total if dates changed
    if (checkInDate || checkOutDate) {
      const room = findRoomById(reservation.roomId);
      const inDate = new Date(checkInDate || reservation.checkInDate);
      const outDate = new Date(checkOutDate || reservation.checkOutDate);
      const daysCount = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
      updates.totalAmount = room.price * daysCount;
    }

    const updatedReservation = updateReservation(req.params.id, updates);

    res.json({
      success: true,
      message: 'Reservation updated successfully',
      data: updatedReservation
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete/Cancel reservation
 * DELETE /api/reservations/:id
 */
export function deleteReservationData(req, res, next) {
  try {
    const reservation = findReservationById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Option 1: Soft delete (mark as cancelled)
    const cancelledReservation = updateReservation(req.params.id, { status: 'Cancelled' });

    res.json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: cancelledReservation
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get reservations by guest
 * GET /api/reservations/guest/:guestId
 */
export function getReservationsByGuest(req, res, next) {
  try {
    const guestReservations = findReservationsByGuestId(req.params.guestId);
    
    res.json({
      success: true,
      data: guestReservations
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get reservation statistics
 * GET /api/reservations/stats/summary
 */
export function getReservationStats(req, res, next) {
  try {
    const totalReservations = reservations.length;
    const confirmedReservations = reservations.filter(r => r.status === 'Confirmed').length;
    const pendingReservations = reservations.filter(r => r.status === 'Pending').length;
    const completedReservations = reservations.filter(r => r.status === 'Completed').length;
    const cancelledReservations = reservations.filter(r => r.status === 'Cancelled').length;

    const totalRevenue = reservations
      .filter(r => r.status !== 'Cancelled')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    res.json({
      success: true,
      data: {
        totalReservations,
        confirmedReservations,
        pendingReservations,
        completedReservations,
        cancelledReservations,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
}
