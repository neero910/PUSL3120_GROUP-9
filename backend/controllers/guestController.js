/**
 * Guests Controller
 * Handles CRUD operations for guests
 */

import { guests, addGuest, findGuestById, findGuestByEmail, updateGuest, deleteGuest } from '../data/guests.js';

/**
 * Get all guests
 * GET /api/guests
 */
export function getAllGuests(req, res, next) {
  try {
    res.json({
      success: true,
      data: guests
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single guest by ID
 * GET /api/guests/:id
 */
export function getGuestById(req, res, next) {
  try {
    const guest = findGuestById(req.params.id);
    
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    res.json({
      success: true,
      data: guest
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create new guest
 * POST /api/guests
 */
export function createGuest(req, res, next) {
  try {
    const { firstName, lastName, email, phone, nicPassport, address, nationality } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, and phone are required'
      });
    }

    // Check if email already exists
    const existingGuest = findGuestByEmail(email);
    if (existingGuest) {
      return res.status(400).json({
        success: false,
        message: 'Guest with this email already exists'
      });
    }

    const newGuest = addGuest({
      firstName,
      lastName,
      email,
      phone,
      nicPassport: nicPassport || '',
      address: address || '',
      nationality: nationality || '',
      status: 'Active'
    });

    res.status(201).json({
      success: true,
      message: 'Guest created successfully',
      data: newGuest
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update guest
 * PUT /api/guests/:id
 */
export function updateGuestData(req, res, next) {
  try {
    const guest = findGuestById(req.params.id);
    
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    const { firstName, lastName, email, phone, nicPassport, address, nationality, status } = req.body;

    // Check email uniqueness if changed
    if (email && email !== guest.email) {
      if (findGuestByEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (nicPassport !== undefined) updates.nicPassport = nicPassport;
    if (address !== undefined) updates.address = address;
    if (nationality !== undefined) updates.nationality = nationality;
    if (status !== undefined) updates.status = status;

    const updatedGuest = updateGuest(req.params.id, updates);

    res.json({
      success: true,
      message: 'Guest updated successfully',
      data: updatedGuest
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete guest
 * DELETE /api/guests/:id
 */
export function deleteGuestData(req, res, next) {
  try {
    const deletedGuest = deleteGuest(req.params.id);
    
    if (!deletedGuest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    res.json({
      success: true,
      message: 'Guest deleted successfully',
      data: deletedGuest
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get guest statistics
 * GET /api/guests/stats/summary
 */
export function getGuestStats(req, res, next) {
  try {
    const totalGuests = guests.length;
    const activeGuests = guests.filter(g => g.status === 'Active').length;
    const inactiveGuests = guests.filter(g => g.status === 'Inactive').length;

    res.json({
      success: true,
      data: {
        totalGuests,
        activeGuests,
        inactiveGuests
      }
    });
  } catch (error) {
    next(error);
  }
}
