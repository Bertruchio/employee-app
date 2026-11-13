import { useCallback, useState } from 'react';
import type { FormEvent } from 'react';
import { validateAuthCredentials } from '@shared/validators';
import type { User } from '@shared/types/auth.types';
import { DEMO_CREDENTIALS, UI_MESSAGES } from '../constants';
import { ApiClientError } from '../services/api.client';
import { authApi } from '../services/auth.api';
import type { AuthMode, UseAuthFormReturn } from '../types/ui.types';

export const useAuthForm = (
  onSuccess: (user: User, token: string) => void,
): UseAuthFormReturn => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmailState] = useState<string>('');
  const [password, setPasswordState] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const switchMode = useCallback((nextMode: AuthMode) => {
    setMode(nextMode);
    setFieldErrors({});
    setServerError('');
  }, []);

  const setEmail = useCallback((value: string) => {
    setEmailState(value);
    setFieldErrors((prev) => ({ ...prev, email: '' }));
    setServerError('');
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordState(value);
    setFieldErrors((prev) => ({ ...prev, password: '' }));
    setServerError('');
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const fillDemoCredentials = useCallback(() => {
    setMode('login');
    setEmailState(DEMO_CREDENTIALS.email);
    setPasswordState(DEMO_CREDENTIALS.password);
    setFieldErrors({});
    setServerError('');
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return;

      const validation = validateAuthCredentials({ email, password });
      if (!validation.isValid) {
        setFieldErrors(validation.errors);
        return;
      }

      setIsSubmitting(true);
      setFieldErrors({});
      setServerError('');

      try {
        const response =
          mode === 'login'
            ? await authApi.login(validation.data)
            : await authApi.register(validation.data);
        onSuccess(response.user, response.token);
      } catch (err: unknown) {
        if (err instanceof ApiClientError) {
          setServerError(err.message);
          if (err.fieldErrors) {
            setFieldErrors(err.fieldErrors);
          }
        } else {
          setServerError(UI_MESSAGES.UNKNOWN_ERROR);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, email, password, mode, onSuccess],
  );

  return {
    mode,
    email,
    password,
    showPassword,
    fieldErrors,
    serverError,
    isSubmitting,
    switchMode,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    fillDemoCredentials,
    handleSubmit,
  };
};
