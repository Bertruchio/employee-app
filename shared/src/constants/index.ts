export const DEPARTMENTS = Object.freeze([
  'Разработка',
  'Тестирование',
  'Аналитика',
  'Дизайн',
  'HR',
  'Менеджмент'
] as const);

export const VALIDATION_RULES = Object.freeze({
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_BYTES: 72,
  FULL_NAME_MIN_LENGTH: 2,
  FULL_NAME_MAX_LENGTH: 120,
  POSITION_MIN_LENGTH: 2,
  POSITION_MAX_LENGTH: 100,
} as const);

export const API_ENDPOINTS = Object.freeze({
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  EMPLOYEES: {
    BASE: '/api/employees',
  }
} as const);

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VALIDATION_MESSAGES = Object.freeze({
  REQUIRED: 'Обязательное поле',
  INVALID_EMAIL: 'Некорректный формат email',
  PASSWORD_MIN: `Пароль должен содержать минимум ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} символов`,
  PASSWORD_MAX_BYTES: `Пароль превышает допустимый размер (${VALIDATION_RULES.PASSWORD_MAX_BYTES} байт)`,
  FULL_NAME_LENGTH: `ФИО должно быть от ${VALIDATION_RULES.FULL_NAME_MIN_LENGTH} до ${VALIDATION_RULES.FULL_NAME_MAX_LENGTH} символов`,
  POSITION_LENGTH: `Должность должна быть от ${VALIDATION_RULES.POSITION_MIN_LENGTH} до ${VALIDATION_RULES.POSITION_MAX_LENGTH} символов`,
  INVALID_DEPARTMENT: 'Выбран некорректный отдел',
} as const);
