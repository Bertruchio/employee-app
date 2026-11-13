import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthPage } from './pages/AuthPage/AuthPage';
import { DirectoryPage } from './pages/DirectoryPage/DirectoryPage';

const AppRouter = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="directory-page__content" role="status">
        Загрузка...
      </div>
    );
  }

  return isAuthenticated ? <DirectoryPage /> : <AuthPage />;
};

export const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
