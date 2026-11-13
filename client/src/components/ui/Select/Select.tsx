import { useId } from 'react';
import type { SelectProps } from '../../../types/ui.types';
import './Select.css';

export const Select = ({
  label,
  options,
  placeholder,
  error,
  id,
  className = '',
  ...props
}: SelectProps) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;
  const selectClasses = ['ui-select__control', error ? 'ui-select__control--error' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="ui-select">
      <label className="ui-select__label" htmlFor={fieldId}>
        {label}
      </label>
      <select
        id={fieldId}
        className={selectClasses}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={errorId} className="ui-select__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
