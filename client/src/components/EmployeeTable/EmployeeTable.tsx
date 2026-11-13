import type { EmployeeTableProps } from '../../types/ui.types';
import { Button } from '../ui/Button/Button';
import './EmployeeTable.css';

export const EmployeeTable = ({
  employees,
  isLoading,
  hasActiveFilters,
  onResetFilters,
}: EmployeeTableProps) => {
  if (isLoading) {
    return (
      <div className="employee-table__state" role="status">
        Загрузка списка сотрудников...
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="employee-table__state">
        <p className="employee-table__empty-title">
          {hasActiveFilters
            ? 'По вашему запросу сотрудники не найдены'
            : 'Список сотрудников пока пуст'}
        </p>
        {hasActiveFilters && (
          <Button variant="secondary" onClick={onResetFilters}>
            Сбросить фильтры
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="employee-table__wrapper">
      <table className="employee-table">
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Должность</th>
            <th>Отдел</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td className="employee-table__name">{emp.fullName}</td>
              <td>{emp.position}</td>
              <td>
                <span className="employee-table__badge">{emp.department}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
