import type { AlertProps } from '../../../types/ui.types';
import './Alert.css';

export const Alert = ({ message, variant = 'error' }: AlertProps) => {
  return (
    <div className={`ui-alert ui-alert--${variant}`} role="alert">
      {message}
    </div>
  );
};
