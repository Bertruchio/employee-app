import type Database from 'better-sqlite3';
import bcrypt        from 'bcryptjs';
import { SERVER_CONSTANTS } from '../config/constants';
interface EmployeeRow {
  full_name:  string;
  position:   string;
  department: string;
}
const DEMO_EMPLOYEES: EmployeeRow[] = [
  { full_name: 'Иванов Иван Иванович',         position: 'Frontend-разработчик', department: 'Разработка'   },
  { full_name: 'Петров Пётр Петрович',          position: 'QA-инженер',            department: 'Тестирование' },
  { full_name: 'Сидорова Анна Ивановна',        position: 'UX/UI-дизайнер',        department: 'Дизайн'       },
  { full_name: 'Смирнов Алексей Сергеевич',     position: 'Менеджер проектов',      department: 'Менеджмент'   },
  { full_name: 'Кузнецова Мария Александровна', position: 'HR-специалист',          department: 'HR'           },
];
export const seedDatabase = (db: Database.Database): void => {
  // ── Demo user ──────────────────────────────────────────────────────────────
  const userExists = db
    .prepare('SELECT COUNT(*) as count FROM users WHERE email = ?')
    .get(SERVER_CONSTANTS.DEMO_USER.email) as { count: number };
  if (userExists.count === 0) {
    const hash = bcrypt.hashSync(
      SERVER_CONSTANTS.DEMO_USER.password,
      SERVER_CONSTANTS.BCRYPT_SALT_ROUNDS,
    );
    db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(
      SERVER_CONSTANTS.DEMO_USER.email,
      hash,
    );
  }
  // ── Demo employees ─────────────────────────────────────────────────────────
  const empCount = db
    .prepare('SELECT COUNT(*) as count FROM employees')
    .get() as { count: number };
  if (empCount.count === 0) {
    const insert = db.prepare(
      'INSERT INTO employees (full_name, position, department) VALUES (@full_name, @position, @department)',
    );
    const seedAll = db.transaction((rows: EmployeeRow[]) => {
      for (const row of rows) insert.run(row);
    });
    seedAll(DEMO_EMPLOYEES);
  }
};
