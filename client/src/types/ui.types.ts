import type { ButtonHTMLAttributes, FormEvent, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import type { User } from '@shared/types/auth.types';
import type { CreateEmployeeDto, Department, Employee } from '@shared/types/employee.types';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  error?: string;
}

export type AlertVariant = 'error' | 'success' | 'info';

export interface AlertProps {
  message: string;
  variant?: AlertVariant;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

export type DepartmentSelectValue = Department | '';
export type AuthMode = 'login' | 'register';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setSession: (user: User, token: string) => void;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface UseAuthFormReturn {
  mode: AuthMode;
  email: string;
  password: string;
  showPassword: boolean;
  fieldErrors: Record<string, string>;
  serverError: string;
  isSubmitting: boolean;
  switchMode: (nextMode: AuthMode) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  togglePasswordVisibility: () => void;
  fillDemoCredentials: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface UseEmployeesReturn {
  employees: Employee[];
  search: string;
  department: DepartmentSelectValue;
  isLoading: boolean;
  error: string;
  hasActiveFilters: boolean;
  setSearch: (value: string) => void;
  setDepartment: (value: DepartmentSelectValue) => void;
  resetFilters: () => void;
  addEmployeeToList: (employee: Employee) => void;
}

export interface UseEmployeeFormReturn {
  isOpen: boolean;
  fullName: string;
  position: string;
  department: DepartmentSelectValue;
  fieldErrors: Record<string, string>;
  serverError: string;
  isSubmitting: boolean;
  openModal: () => void;
  closeModal: () => void;
  setFullName: (value: string) => void;
  setPosition: (value: string) => void;
  setDepartment: (value: DepartmentSelectValue) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface HeaderProps {
  userEmail: string;
  onLogout: () => void;
}

export interface FilterBarProps {
  search: string;
  department: DepartmentSelectValue;
  totalCount: number;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: DepartmentSelectValue) => void;
  onResetFilters: () => void;
  onOpenCreateModal: () => void;
}

export interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export interface EmployeeFormModalProps {
  isOpen: boolean;
  fullName: string;
  position: string;
  department: DepartmentSelectValue;
  fieldErrors: Record<string, string>;
  serverError: string;
  isSubmitting: boolean;
  onClose: () => void;
  onFullNameChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onDepartmentChange: (value: DepartmentSelectValue) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export type OnEmployeeCreated = (employee: Employee) => void;
export type CreateEmployeePayload = CreateEmployeeDto;
