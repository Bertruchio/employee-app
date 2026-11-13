export const STORAGE_KEYS = Object.freeze({
  AUTH_TOKEN: 'employee_dir_token',
} as const);

export const AUTH_EVENTS = Object.freeze({
  UNAUTHORIZED: 'auth:unauthorized',
} as const);

export const SEARCH_DEBOUNCE_MS = 300;

export const DEMO_CREDENTIALS = Object.freeze({
  email: 'demo@company.ru',
  password: 'Demo1234!',
} as const);

export const UI_MESSAGES = Object.freeze({
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к серверу.',
  UNKNOWN_ERROR: 'Произошла непредвиденная ошибка.',
  LOADING: 'Загрузка...',
} as const);
