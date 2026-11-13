import { useCallback, useEffect, useState } from 'react';
import type { Employee } from '@shared/types/employee.types';
import { SEARCH_DEBOUNCE_MS, UI_MESSAGES } from '../constants';
import { ApiClientError } from '../services/api.client';
import { employeeApi } from '../services/employee.api';
import type { DepartmentSelectValue, UseEmployeesReturn } from '../types/ui.types';
import { useDebounce } from './useDebounce';

export const useEmployees = (): UseEmployeesReturn => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState<string>('');
  const [department, setDepartment] = useState<DepartmentSelectValue>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError('');

    employeeApi
      .getAll({ search: debouncedSearch, department }, controller.signal)
      .then((list) => {
        setEmployees(list);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError(UI_MESSAGES.UNKNOWN_ERROR);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [debouncedSearch, department]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setDepartment('');
  }, []);

  const addEmployeeToList = useCallback(
    (created: Employee) => {
      const matchesDept = !department || created.department === department;
      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch || created.fullName.toLowerCase().includes(normalizedSearch);

      if (matchesDept && matchesSearch) {
        setEmployees((prev) => [created, ...prev]);
      }
    },
    [department, search],
  );

  return {
    employees,
    search,
    department,
    isLoading,
    error,
    hasActiveFilters: Boolean(search.trim() || department),
    setSearch,
    setDepartment,
    resetFilters,
    addEmployeeToList,
  };
};
