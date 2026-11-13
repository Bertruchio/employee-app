import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { Alert } from '../Alert/Alert';

describe('Base UI Components', () => {
  describe('Button', () => {
    it('renders children and handles click', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Сохранить</Button>);

      const btn = screen.getByRole('button', { name: 'Сохранить' });
      await user.click(btn);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('disables button and shows loading state when isLoading is true', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button isLoading onClick={onClick}>
          Сохранить
        </Button>,
      );

      const btn = screen.getByRole('button');
      expect(btn).toBeDisabled();
      await user.click(btn);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Input', () => {
    it('associates label with input and displays validation error with aria-invalid', () => {
      render(<Input label="Email" id="email-input" error="Некорректный email" />);

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByText('Некорректный email')).toBeInTheDocument();
    });
  });

  describe('Select', () => {
    it('renders label, placeholder and options', () => {
      render(
        <Select
          label="Отдел"
          id="dept-select"
          placeholder="Выберите отдел"
          options={[
            { value: 'Разработка', label: 'Разработка' },
            { value: 'HR', label: 'HR' },
          ]}
        />,
      );

      const select = screen.getByLabelText('Отдел');
      expect(select).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Выберите отдел' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Разработка' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'HR' })).toBeInTheDocument();
    });
  });

  describe('Alert', () => {
    it('renders alert message with role="alert"', () => {
      render(<Alert variant="error" message="Неверный email или пароль" />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Неверный email или пароль');
    });
  });
});
