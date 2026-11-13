import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { validateCreateEmployee } from '@shared/validators';
import { UI_MESSAGES } from '../constants';
import { ApiClientError } from '../services/api.client';
import { employeeApi } from '../services/employee.api';
import type {
  DepartmentSelectValue,
  OnEmployeeCreated,
  UseEmployeeFormReturn,
} from '../types/ui.types';

export const useEmployeeForm = (onCreated: OnEmployeeCreated): UseEmployeeFormReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [fullName, setFullNameState] = useState<string>('');
  const [position, setPositionState] = useState<string>('');
  const [department, setDepartmentState] = useState<DepartmentSelectValue>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const resetFormState = useCallback(() => {
    setFullNameState('');
    setPositionState('');
    setDepartmentState('');
    setFieldErrors({});
    setServerError('');
  }, []);

  const openModal = useCallback(() => {
    resetFormState();
    setIsOpen(true);
  }, [resetFormState]);

  const closeModal = useCallback(() => {
    if (isSubmitting) return;
    setIsOpen(false);
    resetFormState();
  }, [isSubmitting, resetFormState]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  const setFullName = useCallback((value: string) => {
    setFullNameState(value);
    setFieldErrors((prev) => ({ ...prev, fullName: '' }));
    setServerError('');
  }, []);

  const setPosition = useCallback((value: string) => {
    setPositionState(value);
    setFieldErrors((prev) => ({ ...prev, position: '' }));
    setServerError('');
  }, []);

  const setDepartment = useCallback((value: DepartmentSelectValue) => {
    setDepartmentState(value);
    setFieldErrors((prev) => ({ ...prev, department: '' }));
    setServerError('');
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return;

      const validation = validateCreateEmployee({ fullName, position, department });
      if (!validation.isValid) {
        setFieldErrors(validation.errors);
        return;
      }

      setIsSubmitting(true);
      setFieldErrors({});
      setServerError('');

      try {
        const created = await employeeApi.create(validation.data);
        onCreated(created);
        setIsOpen(false);
        resetFormState();
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
    [isSubmitting, fullName, position, department, onCreated, resetFormState],
  );

  return {
    isOpen,
    fullName,
    position,
    department,
    fieldErrors,
    serverError,
    isSubmitting,
    openModal,
    closeModal,
    setFullName,
    setPosition,
    setDepartment,
    handleSubmit,
  };
};
