import { API_ENDPOINTS } from '@shared/constants';
import type {
  CreateEmployeeDto,
  Employee,
  EmployeeFilterParams,
} from '@shared/types/employee.types';
import { apiRequest } from './api.client';

export const employeeApi = Object.freeze({
  getAll: (filter: EmployeeFilterParams = {}, signal?: AbortSignal): Promise<Employee[]> => {
    const params = new URLSearchParams();
    if (filter.search?.trim()) {
      params.set('search', filter.search.trim());
    }
    if (filter.department) {
      params.set('department', filter.department);
    }

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.EMPLOYEES.BASE}?${queryString}`
      : API_ENDPOINTS.EMPLOYEES.BASE;

    return signal
      ? apiRequest<Employee[]>(url, { signal })
      : apiRequest<Employee[]>(url);
  },

  create: (dto: CreateEmployeeDto): Promise<Employee> =>
    apiRequest<Employee>(API_ENDPOINTS.EMPLOYEES.BASE, {
      method: 'POST',
      body: dto,
    }),
});
