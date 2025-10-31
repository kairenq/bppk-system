import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'teacher':
        return '/teacher';
      case 'student':
        return '/student';
      default:
        return '/';
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to={getDashboardLink()} style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
            БППК - Тестирование
          </Link>
          {user && (
            <nav style={{ display: 'flex', gap: '1rem' }}>
              <Link to={getDashboardLink()} style={{ color: 'white', textDecoration: 'none' }}>
                Главная
              </Link>
            </nav>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <span>
                {user.last_name} {user.first_name} {user.middle_name || ''} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Вход</Link>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Регистрация</Link>
            </>
          )}
        </div>
      </header>
      <main style={{ flex: 1, padding: '2rem', backgroundColor: '#ecf0f1' }}>
        {children}
      </main>
      <footer style={{
        backgroundColor: '#34495e',
        color: 'white',
        padding: '1rem 2rem',
        textAlign: 'center'
      }}>
        <p>&copy; 2024 БППК. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default Layout;
