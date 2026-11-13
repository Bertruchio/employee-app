import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiRequest, ApiClientError } from '../api.client';
import { STORAGE_KEYS, AUTH_EVENTS } from '../../constants';

describe('apiRequest', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('attaches Bearer token from localStorage and returns parsed data', async () => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'test-jwt-token');

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: { id: 1 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await apiRequest<{ id: number }>('/api/employees');

    expect(result).toEqual({ id: 1 });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/employees',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-jwt-token',
        }),
      }),
    );
  });

  it('clears token, dispatches unauthorized event and throws ApiClientError on 401', async () => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'expired-token');
    const eventSpy = vi.fn();
    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, eventSpy);

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: false, message: 'Требуется авторизация' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(apiRequest('/api/employees')).rejects.toThrow(ApiClientError);
    expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
    expect(eventSpy).toHaveBeenCalledTimes(1);

    window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, eventSpy);
  });
});
