import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { authApi } from '../services/auth.api';
import { employeeApi } from '../services/employee.api';
import { DEMO_CREDENTIALS } from '../constants';

vi.mock('../services/auth.api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
  },
}));

vi.mock('../services/employee.api', () => ({
  employeeApi: {
    getAll: vi.fn(),
    create: vi.fn(),
  },
}));

describe('Application Flows', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('logs in via demo button, displays employees and creates a new employee via modal', async () => {
    const user = userEvent.setup();

    vi.mocked(authApi.login).mockResolvedValue({
      token: 'valid-jwt',
      user: { id: 1, email: DEMO_CREDENTIALS.email, createdAt: '2026-01-01' },
    });

    vi.mocked(employeeApi.getAll).mockResolvedValue([
      {
        id: 1,
        fullName: 'Иванов Иван Иванович',
        position: 'Frontend Разработчик',
        department: 'Разработка',
        createdAt: '2026-01-01',
      },
    ]);

    vi.mocked(employeeApi.create).mockResolvedValue({
      id: 2,
      fullName: 'Новикова Елена Сергеевна',
      position: 'Системный аналитик',
      department: 'Аналитика',
      createdAt: '2026-01-02',
    });

    render(<App />);

    expect(screen.getByRole('heading', { name: /список сотрудников/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /демо/i }));
    await user.click(screen.getByRole('button', { name: /войти/i }));

    await waitFor(() => {
      expect(screen.getByText('Иванов Иван Иванович')).toBeInTheDocument();
    });
    expect(screen.getByText(DEMO_CREDENTIALS.email)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /добавить сотрудника/i }));

    const dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByLabelText(/фио/i), 'Новикова Елена Сергеевна');
    await user.type(within(dialog).getByLabelText(/должность/i), 'Системный аналитик');
    await user.selectOptions(within(dialog).getByLabelText(/отдел/i), 'Аналитика');

    await user.click(within(dialog).getByRole('button', { name: /сохранить/i }));

    await waitFor(() => {
      expect(screen.getByText('Новикова Елена Сергеевна')).toBeInTheDocument();
    });
  });
});
