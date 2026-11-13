import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FormEvent } from 'react';
import { useDebounce } from '../useDebounce';
import { useAuthForm } from '../useAuthForm';
import { useEmployees } from '../useEmployees';
import { authApi } from '../../services/auth.api';
import { employeeApi } from '../../services/employee.api';
import { DEMO_CREDENTIALS } from '../../constants';

describe('Custom Hooks', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('useDebounce', () => {
    it('delays value update', async () => {
      vi.useFakeTimers();
      const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
        initialProps: { val: 'Иван' },
      });

      expect(result.current).toBe('Иван');
      rerender({ val: 'Иванов' });
      expect(result.current).toBe('Иван');

      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(result.current).toBe('Иванов');
      vi.useRealTimers();
    });
  });

  describe('useAuthForm', () => {
    it('fills demo credentials and submits login', async () => {
      const onSuccess = vi.fn();
      const loginSpy = vi.spyOn(authApi, 'login').mockResolvedValue({
        token: 'jwt-123',
        user: { id: 1, email: DEMO_CREDENTIALS.email, createdAt: '2026-01-01' },
      });

      const { result } = renderHook(() => useAuthForm(onSuccess));

      act(() => {
        result.current.fillDemoCredentials();
      });

      expect(result.current.email).toBe(DEMO_CREDENTIALS.email);
      expect(result.current.password).toBe(DEMO_CREDENTIALS.password);

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>);
      });

      expect(loginSpy).toHaveBeenCalledWith(DEMO_CREDENTIALS);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  describe('useEmployees', () => {
    it('loads employees and resets filters', async () => {
      const getAllSpy = vi.spyOn(employeeApi, 'getAll').mockResolvedValue([
        { id: 1, fullName: 'Иванов Иван', position: 'Dev', department: 'Разработка', createdAt: '2026-01-01' },
      ]);

      const { result } = renderHook(() => useEmployees());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.employees).toHaveLength(1);
      expect(getAllSpy).toHaveBeenCalled();

      act(() => {
        result.current.setDepartment('HR');
      });
      expect(result.current.hasActiveFilters).toBe(true);

      act(() => {
        result.current.resetFilters();
      });
      expect(result.current.hasActiveFilters).toBe(false);
      expect(result.current.department).toBe('');
    });
  });
});
