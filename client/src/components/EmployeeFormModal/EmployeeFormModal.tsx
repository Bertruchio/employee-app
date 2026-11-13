import { DEPARTMENT_OPTIONS } from '../../constants';
import type { DepartmentSelectValue, EmployeeFormModalProps } from '../../types/ui.types';
import { Alert } from '../ui/Alert/Alert';
import { Button } from '../ui/Button/Button';
import { Input } from '../ui/Input/Input';
import { Select } from '../ui/Select/Select';
import './EmployeeFormModal.css';

export const EmployeeFormModal = ({
  isOpen,
  fullName,
  position,
  department,
  fieldErrors,
  serverError,
  isSubmitting,
  onClose,
  onFullNameChange,
  onPositionChange,
  onDepartmentChange,
  onSubmit,
}: EmployeeFormModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-employee-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-card">
        <div className="modal-card__header">
          <h2 id="create-employee-title" className="modal-card__title">
            Новый сотрудник
          </h2>
          <button
            type="button"
            className="modal-card__close"
            onClick={onClose}
            aria-label="Закрыть окно"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form className="modal-card__form" onSubmit={onSubmit} noValidate>
          {serverError && <Alert variant="error" message={serverError} />}

          <Input
            label="ФИО"
            placeholder="Иванов Иван Иванович"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            error={fieldErrors.fullName}
            disabled={isSubmitting}
            autoFocus
            required
          />

          <Input
            label="Должность"
            placeholder="Frontend Разработчик"
            value={position}
            onChange={(e) => onPositionChange(e.target.value)}
            error={fieldErrors.position}
            disabled={isSubmitting}
            required
          />

          <Select
            label="Отдел"
            placeholder="Выберите отдел"
            options={DEPARTMENT_OPTIONS}
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value as DepartmentSelectValue)}
            error={fieldErrors.department}
            disabled={isSubmitting}
            required
          />

          <div className="modal-card__actions">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
