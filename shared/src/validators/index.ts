import { DEPARTMENTS, EMAIL_REGEX, VALIDATION_RULES, VALIDATION_MESSAGES } from '../constants/index.js';
import type { Department, CreateEmployeeDto } from '../types/employee.types.js';
import type { AuthCredentialsDto } from '../types/auth.types.js';
import type { ValidationResult } from '../types/api.types.js';

export const isDepartment = (value: unknown): value is Department => {
  return typeof value === 'string' && DEPARTMENTS.includes(value as Department);
};

const cleanString = (str: unknown): string => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ');
};

const getByteLength = (str: string): number => {
  let size = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 0x0080) size += 1;
    else if (code < 0x0800) size += 2;
    else size += 3;
  }
  return size;
};

export const validateAuthCredentials = (input: any): ValidationResult<AuthCredentialsDto> => {
  const errors: Record<string, string> = {};
  const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : '';
  const password = typeof input?.password === 'string' ? input.password : '';

  if (!email) errors.email = VALIDATION_MESSAGES.REQUIRED;
  else if (!EMAIL_REGEX.test(email)) errors.email = VALIDATION_MESSAGES.INVALID_EMAIL;

  if (!password) errors.password = VALIDATION_MESSAGES.REQUIRED;
  else if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) errors.password = VALIDATION_MESSAGES.PASSWORD_MIN;
  else if (getByteLength(password) > VALIDATION_RULES.PASSWORD_MAX_BYTES) errors.password = VALIDATION_MESSAGES.PASSWORD_MAX_BYTES;

  if (Object.keys(errors).length > 0) return { isValid: false, errors };
  return { isValid: true, data: { email, password } };
};

export const validateCreateEmployee = (input: any): ValidationResult<CreateEmployeeDto> => {
  const errors: Record<string, string> = {};
  const fullName = cleanString(input?.fullName);
  const position = cleanString(input?.position);
  const department = input?.department;

  if (!fullName) errors.fullName = VALIDATION_MESSAGES.REQUIRED;
  else if (fullName.length < VALIDATION_RULES.FULL_NAME_MIN_LENGTH || fullName.length > VALIDATION_RULES.FULL_NAME_MAX_LENGTH) errors.fullName = VALIDATION_MESSAGES.FULL_NAME_LENGTH;

  if (!position) errors.position = VALIDATION_MESSAGES.REQUIRED;
  else if (position.length < VALIDATION_RULES.POSITION_MIN_LENGTH || position.length > VALIDATION_RULES.POSITION_MAX_LENGTH) errors.position = VALIDATION_MESSAGES.POSITION_LENGTH;

  if (!department) errors.department = VALIDATION_MESSAGES.REQUIRED;
  else if (!isDepartment(department)) errors.department = VALIDATION_MESSAGES.INVALID_DEPARTMENT;

  if (Object.keys(errors).length > 0) return { isValid: false, errors };
  return { isValid: true, data: { fullName, position, department: department as Department } };
};
