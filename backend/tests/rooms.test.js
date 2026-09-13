import request from 'supertest';
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import app from '../server.js';
import Room from '../models/Room.js';
import { getRoomById, createRoom } from '../controllers/roomController.js';

describe('Rooms API & Controller Logic', () => {
  describe('Room Validation', () => {
    it('should return 400 when creating room with missing required fields', async () => {
      const res = await request(app)
        .post('/api/rooms')
        .send({ roomNumber: '801' }); // missing type and price

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('required');
    });

    it('should return 400 when price is missing', async () => {
      const res = await request(app)
        .post('/api/rooms')
        .send({ roomNumber: '802', type: 'Deluxe' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('Room Controller Unit Logic', () => {
    it('getRoomById should return 404 when room is not found', async () => {
      jest.spyOn(Room, 'findOne').mockResolvedValue(null);

      const req = { params: { id: '507f1f77bcf86cd799439099' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await getRoomById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Room not found'
      }));

      Room.findOne.mockRestore();
    });

    it('createRoom should automatically calculate floor from roomNumber if not provided', async () => {
      const mockCreatedRoom = {
        _id: '507f1f77bcf86cd799439088',
        roomNumber: '405',
        floor: 4,
        type: 'Suite',
        price: 25000
      };

      jest.spyOn(Room, 'create').mockResolvedValue(mockCreatedRoom);

      const req = {
        body: {
          roomNumber: '405',
          type: 'Suite',
          price: 25000
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await createRoom(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(Room.create).toHaveBeenCalledWith(expect.objectContaining({
        roomNumber: '405',
        floor: 4,
        price: 25000
      }));

      Room.create.mockRestore();
    });
  });
});
