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

  const getRoleEmoji = (role) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'teacher':
        return '👨‍🏫';
      case 'student':
        return '🎓';
      default:
        return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'var(--accent)';
      case 'teacher':
        return 'var(--info)';
      case 'student':
        return 'var(--success)';
      default:
        return 'var(--primary)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        animation: 'slideIn 0.5s ease-out'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to={getDashboardLink()} style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.textShadow = '0 0 20px rgba(255,255,255,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.textShadow = 'none';
          }}>
            <span style={{fontSize: '1.8rem'}}>🎓</span>
            <span>БППК</span>
          </Link>
          {user && (
            <nav style={{ display: 'flex', gap: '1rem' }}>
              <Link to={getDashboardLink()} style={{
                color: 'rgba(255,255,255,0.9)',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                🏠 Главная
              </Link>
            </nav>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <span style={{fontSize: '1.5rem'}}>{getRoleEmoji(user.role)}</span>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span style={{fontSize: '0.9rem', fontWeight: '600'}}>
                    {user.last_name} {user.first_name} {user.middle_name || ''}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    opacity: 0.9,
                    color: getRoleColor(user.role),
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {user.role === 'admin' ? 'Администратор' : user.role === 'teacher' ? 'Преподаватель' : 'Студент'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
                }}
              >
                <span>🚪</span>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                Вход
              </Link>
              <Link to="/register" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
              }}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </header>
      <main style={{
        flex: 1,
        padding: '2rem',
        background: 'var(--bg-primary)',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        {children}
      </main>
      <footer style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'var(--text-secondary)',
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{fontSize: '1.2rem'}}>🎓</span>
              <span>БППК</span>
            </span>
            <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{fontSize: '1.2rem'}}>📧</span>
              <span>info@bppk.ru</span>
            </span>
            <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{fontSize: '1.2rem'}}>📱</span>
              <span>+7 (XXX) XXX-XX-XX</span>
            </span>
          </div>
          <p style={{fontSize: '0.875rem', opacity: 0.7}}>
            &copy; 2024 БППК. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
