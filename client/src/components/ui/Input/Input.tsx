import { useId } from 'react';
import type { InputProps } from '../../../types/ui.types';
import './Input.css';

export const Input = ({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;
  const inputClasses = ['ui-input__control', error ? 'ui-input__control--error' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="ui-input">
      <label className="ui-input__label" htmlFor={fieldId}>
        {label}
      </label>
      <input
        id={fieldId}
        className={inputClasses}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <span id={errorId} className="ui-input__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
