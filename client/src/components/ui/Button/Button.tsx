import type { ButtonProps } from '../../../types/ui.types';
import { UI_MESSAGES } from '../../../constants';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) => {
  const classes = ['ui-button', `ui-button--${variant}`, className].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? UI_MESSAGES.LOADING : children}
    </button>
  );
};
