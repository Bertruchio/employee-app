import type { HeaderProps } from '../../types/ui.types';
import { Button } from '../ui/Button/Button';
import './Header.css';

export const Header = ({ userEmail, onLogout }: HeaderProps) => {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand">
          <span className="app-header__logo" aria-hidden="true">ED</span>
          <h1 className="app-header__title">Список сотрудников</h1>
        </div>
        <div className="app-header__actions">
          <span className="app-header__user">{userEmail}</span>
          <Button variant="secondary" onClick={onLogout}>
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
};
