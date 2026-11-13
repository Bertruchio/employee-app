import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { ENV } from '../config/env';

export const applySchema = (db: Database.Database): void => {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
};

const createDatabase = (): Database.Database => {
  const isTest = ENV.NODE_ENV === 'test';
  const dbPath = isTest ? ':memory:' : ENV.DB_PATH;

  if (!isTest) {
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
  }

  const db = new Database(dbPath);
  if (!isTest) {
    db.pragma('journal_mode = WAL');
  }
  db.pragma('foreign_keys = ON');
  db.function('lower_utf8', (str: unknown) =>
    typeof str === 'string' ? str.toLowerCase() : '',
  );
  applySchema(db);
  return db;
};

export default createDatabase();
