import request from 'supertest';
import app from '../server.js';

describe('Health Check API', () => {
  it('should return 200 and success status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Hotel Management API is running');
  });
});
