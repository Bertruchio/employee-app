import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import Database from 'better-sqlite3';
import { applySchema } from '../db/database';
import { seedDatabase } from '../db/seed';
import { createRouter } from '../routes/index';
import { errorMiddleware } from '../middleware/error.middleware';

const testDb = new Database(':memory:');
testDb.pragma('journal_mode = WAL');
testDb.pragma('foreign_keys = ON');
testDb.function('lower_utf8', (str: unknown) => (typeof str === 'string' ? str.toLowerCase() : ''));
applySchema(testDb);
seedDatabase(testDb);

const app = express();
app.use(express.json());
app.use('/api', createRouter(testDb));
app.use(errorMiddleware);

const DEMO = { email: 'demo@company.ru', password: 'Demo1234!' };
let authToken = '';

describe('POST /api/auth/register', () => {
  it('registers a new user and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new@test.ru', password: 'Pass1234!' });
    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('new@test.ru');
  });
  it('returns 409 on duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new@test.ru', password: 'Pass1234!' });
    expect(res.status).toBe(409);
  });
  it('returns 400 on invalid input', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'bad', password: '1' });
    expect(res.status).toBe(400);
    expect(res.body.fieldErrors).toBeDefined();
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with demo credentials', async () => {
    const res = await request(app).post('/api/auth/login').send(DEMO);
    expect(res.status).toBe(200);
    authToken = res.body.data.token as string;
  });
  it('returns 401 same message for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ ...DEMO, password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Неверный email или пароль');
  });
  it('returns 401 same message for unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'x@x.ru', password: 'Pass1234!' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Неверный email или пароль');
  });
});

describe('GET /api/auth/me', () => {
  it('returns current user with valid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(DEMO.email);
  });
  it('returns 401 without token', async () => {
    expect((await request(app).get('/api/auth/me')).status).toBe(401);
  });
});

describe('GET /api/employees', () => {
  it('returns 401 without token', async () => {
    expect((await request(app).get('/api/employees')).status).toBe(401);
  });
  it('returns all 5 demo employees', async () => {
    const res = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(5);
  });
  it('filters by department', async () => {
    const res = await request(app)
      .get('/api/employees?department=Разработка')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(
      (res.body.data as { department: string }[]).every((e) => e.department === 'Разработка'),
    ).toBe(true);
  });
  it('searches by name case-insensitively (cyrillic)', async () => {
    const res = await request(app)
      .get('/api/employees?search=иванов')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
  it('returns empty for unmatched search', async () => {
    const res = await request(app)
      .get('/api/employees?search=zzznobody')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

describe('POST /api/employees', () => {
  it('returns 401 without token', async () => {
    expect(
      (
        await request(app)
          .post('/api/employees')
          .send({ fullName: 'X', position: 'Y', department: 'HR' })
      ).status,
    ).toBe(401);
  });
  it('creates a new employee', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ fullName: 'Новый Сотрудник', position: 'Аналитик', department: 'Аналитика' });
    expect(res.status).toBe(201);
    expect(res.body.data.fullName).toBe('Новый Сотрудник');
  });
  it('returns 400 on empty fields', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ fullName: '', position: '', department: '' });
    expect(res.status).toBe(400);
    expect(res.body.fieldErrors).toBeDefined();
  });
  it('returns 400 on invalid department', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ fullName: 'X', position: 'Y', department: 'Неизвестный' });
    expect(res.status).toBe(400);
  });
});
