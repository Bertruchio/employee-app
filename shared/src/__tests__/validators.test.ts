import { describe, it, expect } from 'vitest';
import { validateAuthCredentials, validateCreateEmployee, isDepartment } from '../validators/index.js';
import { VALIDATION_MESSAGES } from '../constants/index.js';

describe('Validators', () => {
  describe('isDepartment', () => {
    it('should return true for valid department', () => {
      expect(isDepartment('Разработка')).toBe(true);
    });
    it('should return false for invalid department', () => {
      expect(isDepartment('Уборка')).toBe(false);
    });
  });

  describe('validateAuthCredentials', () => {
    it('should validate correct credentials and trim email, lowercase it', () => {
      const res = validateAuthCredentials({ email: ' Test@Mail.ru ', password: 'password123' });
      expect(res.isValid).toBe(true);
      expect(res.data?.email).toBe('test@mail.ru');
      expect(res.data?.password).toBe('password123'); // пароль не тримится
    });

    it('should fail on invalid email', () => {
      const res = validateAuthCredentials({ email: 'test.ru', password: 'password123' });
      expect(res.isValid).toBe(false);
      expect(res.errors?.email).toBe(VALIDATION_MESSAGES.INVALID_EMAIL);
    });
  });

  describe('validateCreateEmployee', () => {
    it('should validate and sanitize correct employee data', () => {
      const res = validateCreateEmployee({
        fullName: '  Иванов   Иван  ',
        position: ' Разработчик ',
        department: 'Разработка'
      });
      expect(res.isValid).toBe(true);
      expect(res.data?.fullName).toBe('Иванов Иван');
    });

    it('should fail on invalid department', () => {
      const res = validateCreateEmployee({
        fullName: 'Иван',
        position: 'Dev',
        department: 'Несуществующий'
      });
      expect(res.isValid).toBe(false);
      expect(res.errors?.department).toBe(VALIDATION_MESSAGES.INVALID_DEPARTMENT);
    });
  });
});
