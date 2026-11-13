import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@shared/types/auth.types';
import { AUTH_EVENTS, STORAGE_KEYS } from '../constants';
import { authApi } from '../services/auth.api';
import type { AuthContextValue, AuthProviderProps } from '../types/ui.types';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      setIsInitializing(false);
      return;
    }

    let isMounted = true;
    authApi
      .me()
      .then((currentUser) => {
        if (isMounted) {
          setUser(currentUser);
        }
      })
      .catch(() => {
        if (isMounted) {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsInitializing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.AUTH_TOKEN && !event.newValue) {
        setUser(null);
      }
    };

    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const setSession = useCallback((nextUser: User, token: string) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network error on logout
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      setSession,
      logout,
    }),
    [user, isInitializing, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
