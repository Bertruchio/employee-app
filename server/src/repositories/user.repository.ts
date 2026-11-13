import type Database from 'better-sqlite3';
import type { User } from '@shared/types/auth.types';
interface UserRow {
  id:            number;
  email:         string;
  password_hash: string;
  created_at:    string;
}
const toUser = (row: UserRow): User => ({
  id:        row.id,
  email:     row.email,
  createdAt: row.created_at,
});
export class UserRepository {
  constructor(private readonly db: Database.Database) {}
  findByEmail(email: string): (User & { passwordHash: string }) | undefined {
    const row = this.db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as UserRow | undefined;
    if (!row) return undefined;
    return { ...toUser(row), passwordHash: row.password_hash };
  }
  findById(id: number): User | undefined {
    const row = this.db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(id) as UserRow | undefined;
    return row ? toUser(row) : undefined;
  }
  create(email: string, passwordHash: string): User {
    const result = this.db
      .prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
      .run(email, passwordHash);
    const row = this.db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(result.lastInsertRowid) as UserRow;
    return toUser(row);
  }
}
