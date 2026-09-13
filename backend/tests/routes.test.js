import request from 'supertest';
import app from '../server.js';

describe('Protected Routes API Authentication', () => {
  describe('Reservations API', () => {
    it('should return 401 when creating a reservation without auth token', async () => {
      const res = await request(app)
        .post('/api/reservations')
        .send({
          roomId: '507f1f77bcf86cd799439011',
          guestId: '507f1f77bcf86cd799439012',
          checkInDate: '2026-10-01',
          checkOutDate: '2026-10-05',
          numberOfGuests: 2,
          totalAmount: 15000
        });
      expect([401, 403]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should return 401 when updating a reservation without auth token', async () => {
      const res = await request(app)
        .put('/api/reservations/507f1f77bcf86cd799439011')
        .send({ status: 'Cancelled' });
      expect([401, 403]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should return 401 when deleting a reservation without auth token', async () => {
      const res = await request(app)
        .delete('/api/reservations/507f1f77bcf86cd799439011');
      expect([401, 403]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('Guests API', () => {
    it('should return 401 when creating a guest without auth token', async () => {
      const res = await request(app)
        .post('/api/guests')
        .send({ name: 'John Doe', email: 'john@example.com', phone: '0771234567' });
      expect([401, 403]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should return 401 when updating a guest without auth token', async () => {
      const res = await request(app)
        .put('/api/guests/507f1f77bcf86cd799439011')
        .send({ name: 'Jane Doe' });
      expect([401, 403]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('Users API', () => {
    it('should return 401 when accessing user directory without auth token', async () => {
      const res = await request(app).get('/api/users');
      expect([401, 403]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('User Profile API', () => {
    it('should return 401 when accessing /api/auth/me without auth token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect([401, 403]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('success', false);
    });
  });
});
