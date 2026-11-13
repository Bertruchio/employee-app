export const SERVER_CONSTANTS = Object.freeze({
  BCRYPT_SALT_ROUNDS: 12,
  JWT_EXPIRES_IN:     '24h',
  DEMO_USER: {
    email:    'demo@company.ru',
    password: 'Demo1234!',
  },
} as const);
