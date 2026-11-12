import { DEPARTMENTS } from '../constants/index.js';

export type Department = (typeof DEPARTMENTS)[number];

export interface Employee {
  id: number;
  fullName: string;
  position: string;
  department: Department;
  createdAt: string;
}

export interface CreateEmployeeDto {
  fullName: string;
  position: string;
  department: Department;
}

export interface EmployeeFilterParams {
  search?: string;
  department?: Department | '';
}
