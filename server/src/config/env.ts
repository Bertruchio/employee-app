import path from 'path';

const requireEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const ENV = Object.freeze({
  PORT:        parseInt(process.env['PORT'] ?? '4000', 10),
  JWT_SECRET:  requireEnv('JWT_SECRET', 'dev_secret_change_in_production'),
  DB_PATH:     requireEnv('DB_PATH', path.resolve(process.cwd(), 'server', 'data', 'database.sqlite')),
  CORS_ORIGIN: requireEnv('CORS_ORIGIN', 'http://localhost:5173'),
  NODE_ENV:    requireEnv('NODE_ENV', 'development'),
} as const);
