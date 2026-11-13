import { describe, it, expect, beforeAll } from 'vitest';
import Database from 'better-sqlite3';
import { applySchema } from '../db/database';
import { seedDatabase } from '../db/seed';
const db = new Database(':memory:');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.function('lower_utf8', (str: unknown) =>
  typeof str === 'string' ? str.toLowerCase() : '',
);
applySchema(db);
describe('Database: schema', () => {
  it('creates users table', () => {
    const row = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
      .get();
    expect(row).toBeDefined();
  });
  it('creates employees table', () => {
    const row = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='employees'")
      .get();
    expect(row).toBeDefined();
  });
  it('creates index on employees.department', () => {
    const row = db
      .prepare("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_employees_department'")
      .get();
    expect(row).toBeDefined();
  });
});
describe('Database: lower_utf8', () => {
  it('lowercases cyrillic correctly', () => {
    const result = db
      .prepare("SELECT lower_utf8('ИВАНОВ Иван') as val")
      .get() as { val: string };
    expect(result.val).toBe('иванов иван');
  });
  it('handles NULL gracefully', () => {
    const result = db
      .prepare('SELECT lower_utf8(NULL) as val')
      .get() as { val: unknown };
    expect(result.val).toBe('');
  });
  it('handles latin correctly', () => {
    const result = db
      .prepare("SELECT lower_utf8('Hello WORLD') as val")
      .get() as { val: string };
    expect(result.val).toBe('hello world');
  });
});
describe('Database: seeding', () => {
  beforeAll(() => {
    db.exec('DELETE FROM employees; DELETE FROM users;');
    seedDatabase(db);
  });
  it('seeds exactly 5 employees', () => {
    const row = db
      .prepare('SELECT COUNT(*) as count FROM employees')
      .get() as { count: number };
    expect(row.count).toBe(5);
  });
  it('seeds exactly 1 demo user', () => {
    const row = db
      .prepare('SELECT COUNT(*) as count FROM users')
      .get() as { count: number };
    expect(row.count).toBe(1);
  });
  it('demo user password is bcrypt hashed', () => {
    const row = db
      .prepare('SELECT password_hash FROM users LIMIT 1')
      .get() as { password_hash: string };
    expect(row.password_hash).toMatch(/^\$2[aby]\$/);
  });
  it('employees cover at least 4 different departments', () => {
    const rows = db
      .prepare('SELECT DISTINCT department FROM employees')
      .all() as { department: string }[];
    expect(rows.length).toBeGreaterThanOrEqual(4);
  });
  it('seeding is idempotent — no duplicates on second call', () => {
    seedDatabase(db);
    const empRow  = db.prepare('SELECT COUNT(*) as count FROM employees').get() as { count: number };
    const userRow = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    expect(empRow.count).toBe(5);
    expect(userRow.count).toBe(1);
  });
});
