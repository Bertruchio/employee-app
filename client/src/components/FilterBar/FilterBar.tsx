import { DEPARTMENT_OPTIONS } from '../../constants';
import type { DepartmentSelectValue, FilterBarProps } from '../../types/ui.types';
import { Button } from '../ui/Button/Button';
import './FilterBar.css';

export const FilterBar = ({
  search,
  department,
  totalCount,
  hasActiveFilters,
  onSearchChange,
  onDepartmentChange,
  onResetFilters,
  onOpenCreateModal,
}: FilterBarProps) => {
  return (
    <section className="filter-bar" aria-label="Поиск и фильтрация сотрудников">
      <div className="filter-bar__controls">
        <div className="filter-bar__search">
          <label htmlFor="employee-search" className="sr-only">
            Поиск по ФИО
          </label>
          <input
            id="employee-search"
            type="search"
            className="filter-bar__input"
            placeholder="Поиск по ФИО..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="filter-bar__clear"
              onClick={() => onSearchChange('')}
              aria-label="Очистить поиск"
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-bar__select-wrap">
          <label htmlFor="department-filter" className="sr-only">
            Фильтр по отделу
          </label>
          <select
            id="department-filter"
            className="filter-bar__select"
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value as DepartmentSelectValue)}
          >
            <option value="">Все отделы</option>
            {DEPARTMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={onResetFilters}>
            Сбросить фильтры
          </Button>
        )}
      </div>

      <div className="filter-bar__right">
        <span className="filter-bar__count">Найдено: {totalCount}</span>
        <Button variant="primary" onClick={onOpenCreateModal}>
          + Добавить сотрудника
        </Button>
      </div>
    </section>
  );
};
