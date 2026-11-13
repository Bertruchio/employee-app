import { STORAGE_KEYS, AUTH_EVENTS, UI_MESSAGES } from '../constants';
import type { RequestOptions } from '../types/ui.types';

export class ApiClientError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    if (fieldErrors) {
      this.fieldErrors = fieldErrors;
    }
  }
}

export const apiRequest = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body, signal } = options;
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const init: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  if (signal !== undefined) {
    init.signal = signal;
  }

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    throw new ApiClientError(UI_MESSAGES.NETWORK_ERROR, 0);
  }

  let payload: Record<string, unknown> | null = null;
  try {
    payload = (await response.json()) as Record<string, unknown>;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.UNAUTHORIZED));
    }

    const message =
      typeof payload?.message === 'string'
        ? payload.message
        : typeof payload?.error === 'string'
          ? payload.error
          : UI_MESSAGES.UNKNOWN_ERROR;

    const fieldErrors =
      payload?.fieldErrors && typeof payload.fieldErrors === 'object'
        ? (payload.fieldErrors as Record<string, string>)
        : undefined;

    throw new ApiClientError(message, response.status, fieldErrors);
  }

  return (payload?.data ?? payload) as T;
};
