import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiCall, API_BASE_URL } from '../services/api';

describe('Frontend API Service - OCC & Auth Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.alert = vi.fn();
  });

  it('attaches Bearer authorization header when token is stored', async () => {
    localStorage.setItem('token', 'sample_test_jwt_token');

    const mockResponse = {
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true, data: [] })
    };

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    await apiCall('/rooms');

    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_BASE_URL}/rooms`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer sample_test_jwt_token'
        })
      })
    );

    fetchSpy.mockRestore();
  });

  it('omits Bearer authorization header when skipAuth is true', async () => {
    localStorage.setItem('token', 'sample_test_jwt_token');

    const mockResponse = {
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true })
    };

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    await apiCall('/auth/login', { skipAuth: true, method: 'POST', body: { email: 'test@hotel.com' } });

    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_BASE_URL}/auth/login`,
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String)
        })
      })
    );

    fetchSpy.mockRestore();
  });

  it('handles 401 Unauthorized by clearing session and dispatching auth-logout event', async () => {
    localStorage.setItem('token', 'expired_token');
    localStorage.setItem('user', JSON.stringify({ name: 'Old User' }));

    const mockResponse = {
      ok: false,
      status: 401,
      json: async () => ({ message: 'Token expired' })
    };

    vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    await expect(apiCall('/users')).rejects.toThrow(/Token expired/);

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
  });

  it('handles 409 Conflict by alerting user and throwing ConcurrentEditConflict (Phase 3 OCC)', async () => {
    const mockResponse = {
      ok: false,
      status: 409,
      json: async () => ({
        message: 'Conflict: Document has been modified by another user. Please refresh and try again.',
        error: 'VersionError'
      })
    };

    vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    await expect(
      apiCall('/reservations/123', {
        method: 'PUT',
        body: { status: 'Confirmed', __v: 1 }
      })
    ).rejects.toThrow(/ConcurrentEditConflict/);

    expect(global.alert).toHaveBeenCalledWith(
      expect.stringContaining('Conflict: Document has been modified by another user')
    );
  });

  it('returns parsed json payload on successful 200 response', async () => {
    const mockPayload = { success: true, count: 2, data: [{ id: 1 }, { id: 2 }] };
    const mockResponse = {
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => mockPayload
    };

    vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    const result = await apiCall('/rooms');
    expect(result).toEqual(mockPayload);
  });
});
