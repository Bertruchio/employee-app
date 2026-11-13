import type Database from 'better-sqlite3';
import type {
  Employee,
  EmployeeFilterParams,
  CreateEmployeeDto,
} from '@shared/types/employee.types';

interface EmployeeRow {
  id: number;
  full_name: string;
  position: string;
  department: string;
  created_at: string;
}

const toEmployee = (row: EmployeeRow): Employee => ({
  id: row.id,
  fullName: row.full_name,
  position: row.position,
  department: row.department as Employee['department'],
  createdAt: row.created_at,
});

export class EmployeeRepository {
  constructor(private readonly db: Database.Database) {}

  findAll(filter: EmployeeFilterParams = {}): Employee[] {
    // 1. Приводим поиск к нижнему регистру прямо в TS
    const search = filter.search?.trim().toLowerCase() ?? '';
    const department = filter.department ?? '';

    // 2. Заранее формируем паттерн для LIKE
    const searchPattern = search ? '%' + search + '%' : '';

    const rows = this.db
      .prepare(
        `
      SELECT * FROM employees
      WHERE
        (? = '' OR lower_utf8(full_name) LIKE ?)
        AND (? = '' OR department = ?)
      ORDER BY created_at DESC
    `,
      )
      // 3. Передаем чистые переменные без конкатенации в параметрах
      .all(search, searchPattern, department, department) as EmployeeRow[];

    return rows.map(toEmployee);
  }

  create(dto: CreateEmployeeDto): Employee {
    const result = this.db
      .prepare('INSERT INTO employees (full_name, position, department) VALUES (?, ?, ?)')
      .run(dto.fullName, dto.position, dto.department);
    const row = this.db
      .prepare('SELECT * FROM employees WHERE id = ?')
      .get(result.lastInsertRowid) as EmployeeRow;
    return toEmployee(row);
  }
}
