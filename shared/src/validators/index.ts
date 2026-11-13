import {
  DEPARTMENTS,
  EMAIL_REGEX,
  VALIDATION_RULES,
  VALIDATION_MESSAGES,
} from '../constants/index';
import type { FieldErrors, ValidationResult } from '../types/api.types';
import type { AuthCredentialsDto } from '../types/auth.types';
import type { CreateEmployeeDto, Department } from '../types/employee.types';

// ── helpers ───────────────────────────────────────────────────────────────────

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const cleanString = (v: unknown): string =>
  typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '';

export const isDepartment = (v: unknown): v is Department =>
  typeof v === 'string' && (DEPARTMENTS as readonly string[]).includes(v);

/** Байты UTF-8 — важно для bcrypt (молча обрезает после 72-го байта) */
const utf8ByteLength = (s: string): number => {
  let n = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0) ?? 0;
    n += cp <= 0x7f ? 1 : cp <= 0x7ff ? 2 : cp <= 0xffff ? 3 : 4;
  }
  return n;
};

// ── validators ────────────────────────────────────────────────────────────────

export const validateAuthCredentials = (input: unknown): ValidationResult<AuthCredentialsDto> => {
  if (!isRecord(input)) {
    return { isValid: false, errors: { _form: VALIDATION_MESSAGES.REQUIRED } };
  }

  const errors: FieldErrors = {};
  const email = cleanString(input['email']).toLowerCase();
  const password = typeof input['password'] === 'string' ? input['password'] : '';

  if (!email) {
    errors['email'] = VALIDATION_MESSAGES.REQUIRED;
  } else if (!EMAIL_REGEX.test(email)) {
    errors['email'] = VALIDATION_MESSAGES.INVALID_EMAIL;
  }

  if (!password) {
    errors['password'] = VALIDATION_MESSAGES.REQUIRED;
  } else if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors['password'] = VALIDATION_MESSAGES.PASSWORD_MIN;
  } else if (utf8ByteLength(password) > VALIDATION_RULES.PASSWORD_MAX_BYTES) {
    errors['password'] = VALIDATION_MESSAGES.PASSWORD_MAX_BYTES;
  }

  return Object.keys(errors).length > 0
    ? { isValid: false, errors }
    : { isValid: true, data: { email, password } };
};

export const validateCreateEmployee = (input: unknown): ValidationResult<CreateEmployeeDto> => {
  if (!isRecord(input)) {
    return { isValid: false, errors: { _form: VALIDATION_MESSAGES.REQUIRED } };
  }

  const errors: FieldErrors = {};
  const fullName = cleanString(input['fullName']);
  const position = cleanString(input['position']);
  const department = input['department'];

  if (!fullName) {
    errors['fullName'] = VALIDATION_MESSAGES.REQUIRED;
  } else if (
    fullName.length < VALIDATION_RULES.FULL_NAME_MIN_LENGTH ||
    fullName.length > VALIDATION_RULES.FULL_NAME_MAX_LENGTH
  ) {
    errors['fullName'] = VALIDATION_MESSAGES.FULL_NAME_LENGTH;
  }

  if (!position) {
    errors['position'] = VALIDATION_MESSAGES.REQUIRED;
  } else if (
    position.length < VALIDATION_RULES.POSITION_MIN_LENGTH ||
    position.length > VALIDATION_RULES.POSITION_MAX_LENGTH
  ) {
    errors['position'] = VALIDATION_MESSAGES.POSITION_LENGTH;
  }

  if (!department) {
    errors['department'] = VALIDATION_MESSAGES.REQUIRED;
  } else if (!isDepartment(department)) {
    errors['department'] = VALIDATION_MESSAGES.INVALID_DEPARTMENT;
  }

  if (Object.keys(errors).length > 0 || !isDepartment(department)) {
    return { isValid: false, errors };
  }
  return { isValid: true, data: { fullName, position, department } };
};
