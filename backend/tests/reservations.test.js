import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../server.js';
import { generateToken } from '../middleware/authMiddleware.js';
import { updateReservationData } from '../controllers/reservationController.js';
import Reservation from '../models/Reservation.js';
import Room from '../models/Room.js';

describe('Reservations API - Business Logic & OCC', () => {
  const adminToken = generateToken({
    id: '507f1f77bcf86cd799439011',
    email: 'admin@hotel.com',
    name: 'Admin User',
    role: 'Administrator'
  });

  const housekeeperToken = generateToken({
    id: '507f1f77bcf86cd799439012',
    email: 'cleaner@hotel.com',
    name: 'Staff Cleaner',
    role: 'Housekeeper'
  });

  describe('RBAC on Reservations', () => {
    it('should reject reservation creation from unauthorized role (Housekeeper) with 403', async () => {
      const res = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${housekeeperToken}`)
        .send({
          roomId: '507f1f77bcf86cd799439011',
          guestId: '507f1f77bcf86cd799439012',
          checkInDate: '2026-10-01',
          checkOutDate: '2026-10-05'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Forbidden');
    });
  });

  describe('Reservation Input & Date Validation', () => {
    it('should return 400 when missing required booking fields', async () => {
      const res = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ guestId: '507f1f77bcf86cd799439012' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('required');
    });

    it('should return 400 when check-out date is before or same as check-in date', async () => {
      const res = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          guestId: '507f1f77bcf86cd799439012',
          roomId: '507f1f77bcf86cd799439013',
          checkInDate: '2026-10-10',
          checkOutDate: '2026-10-05'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toBe('Check-out date must be after check-in date');
    });

    it('should return 400 for checkRoomAvailability without date parameters', async () => {
      const res = await request(app)
        .get('/api/reservations/availability/room/507f1f77bcf86cd799439013');

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('checkInDate and checkOutDate are required');
    });
  });

  describe('Optimistic Concurrency Control (OCC) Unit Logic', () => {
    it('should detect version mismatch and return 409 Conflict when document was modified concurrently', async () => {
      const existingReservation = {
        _id: '507f1f77bcf86cd799439099',
        room: '507f1f77bcf86cd799439013',
        checkInDate: new Date('2026-11-01'),
        checkOutDate: new Date('2026-11-05'),
        __v: 2
      };

      jest.spyOn(Reservation, 'findOne').mockResolvedValue(existingReservation);
      jest.spyOn(Room, 'findById').mockResolvedValue({ _id: '507f1f77bcf86cd799439013', price: 10000 });
      jest.spyOn(Reservation, 'exists').mockResolvedValue(true);

      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        then: (resolve) => resolve(null)
      };
      jest.spyOn(Reservation, 'findOneAndUpdate').mockReturnValue(mockQuery);

      const req = {
        params: { id: '507f1f77bcf86cd799439099' },
        body: { status: 'Confirmed', __v: 1 }, // Sent stale version 1 while DB is at version 2
        user: { id: '507f1f77bcf86cd799439011', role: 'Administrator' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await updateReservationData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: 'VersionError',
        message: expect.stringContaining('Conflict')
      }));

      Reservation.findOne.mockRestore();
      Room.findById.mockRestore();
      Reservation.exists.mockRestore();
      Reservation.findOneAndUpdate.mockRestore();
    });
  });
});
