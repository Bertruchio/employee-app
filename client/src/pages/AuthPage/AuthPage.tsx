import { Alert } from '../../components/ui/Alert/Alert';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { useAuth } from '../../hooks/useAuth';
import { useAuthForm } from '../../hooks/useAuthForm';
import './AuthPage.css';

export const AuthPage = () => {
  const { setSession } = useAuth();
  const {
    mode,
    email,
    password,
    showPassword,
    fieldErrors,
    serverError,
    isSubmitting,
    switchMode,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    fillDemoCredentials,
    handleSubmit,
  } = useAuthForm(setSession);

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__header">
          <h1 className="auth-card__title">Список сотрудников</h1>
          <p className="auth-card__subtitle">
            {mode === 'login'
              ? 'Войдите в систему для доступа к справочнику'
              : 'Создайте учётную запись для работы со списком'}
          </p>
        </div>

        <div className="auth-card__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={`auth-card__tab ${mode === 'login' ? 'auth-card__tab--active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Вход
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            className={`auth-card__tab ${mode === 'register' ? 'auth-card__tab--active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Регистрация
          </button>
        </div>

        <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
          {serverError && <Alert variant="error" message={serverError} />}

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="demo@company.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            disabled={isSubmitting}
            required
          />

          <div className="auth-card__password-group">
            <Input
              label="Пароль"
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              disabled={isSubmitting}
              required
            />
            <button
              type="button"
              className="auth-card__toggle-pwd"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            </button>
          </div>

          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </form>

        <div className="auth-card__footer">
          <Button variant="secondary" onClick={fillDemoCredentials} disabled={isSubmitting}>
            Заполнить демо-доступ
          </Button>
        </div>
      </section>
    </main>
  );
};
