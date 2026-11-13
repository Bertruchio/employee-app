import Database from 'better-sqlite3';
import fs        from 'fs';
import path      from 'path';
import { ENV }   from '../config/env';
/**
 * Применяет schema.sql к переданному экземпляру БД.
 * Вынесено отдельно чтобы тесты могли передавать :memory: инстанс.
 */
export const applySchema = (db: Database.Database): void => {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema     = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
};
const createDatabase = (): Database.Database => {
  const dbDir = path.dirname(ENV.DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const db = new Database(ENV.DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.function('lower_utf8', (str: unknown) =>
    typeof str === 'string' ? str.toLowerCase() : '',
  );
  applySchema(db);
  return db;
};
export default createDatabase();
