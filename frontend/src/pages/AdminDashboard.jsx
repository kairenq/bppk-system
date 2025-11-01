import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('statistics');
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
    last_name: '',
    first_name: '',
    middle_name: '',
    role: 'student',
  });
  const [courseFormData, setCourseFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'courses') {
      loadCourses();
    }
  }, [activeTab]);

  const loadStatistics = async () => {
    try {
      const response = await adminAPI.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
    setLoading(false);
  };

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;

    try {
      await adminAPI.deleteUser(id);
      loadUsers();
      alert('Пользователь удален ✓');
    } catch (error) {
      alert('Ошибка при удалении пользователя');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createUser(userFormData);
      setShowUserForm(false);
      setUserFormData({
        email: '',
        password: '',
        last_name: '',
        first_name: '',
        middle_name: '',
        role: 'student',
      });
      loadUsers();
      alert('Пользователь успешно создан ✓');
    } catch (error) {
      alert('Ошибка при создании пользователя');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createCourse(courseFormData);
      setShowCourseForm(false);
      setCourseFormData({ name: '', description: '' });
      loadCourses();
      alert('Курс успешно создан ✓');
    } catch (error) {
      alert('Ошибка при создании курса');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот курс?')) return;

    try {
      await adminAPI.deleteCourse(id);
      loadCourses();
      alert('Курс удален ✓');
    } catch (error) {
      alert('Ошибка при удалении курса');
    }
  };

  return (
    <Layout>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700'
          }}>
            👑 Панель администратора
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem'
          }}>
            Управление системой и мониторинг
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { id: 'statistics', label: 'Статистика', icon: '📊' },
            { id: 'users', label: 'Пользователи', icon: '👥' },
            { id: 'courses', label: 'Курсы', icon: '📚' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 2rem',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'var(--bg-card)',
                color: 'white',
                border: activeTab === tab.id ? 'none' : '2px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(245, 158, 11, 0.4)' : 'none',
                minWidth: '180px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                }
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Statistics Tab */}
        {activeTab === 'statistics' && statistics && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            {[
              {
                title: 'Всего пользователей',
                value: statistics.total_users,
                icon: '👥',
                gradient: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                color: '#6366f1'
              },
              {
                title: 'Студентов',
                value: statistics.total_students,
                icon: '🎓',
                gradient: 'var(--gradient-success)',
                color: '#10b981'
              },
              {
                title: 'Преподавателей',
                value: statistics.total_teachers,
                icon: '👨‍🏫',
                gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                color: '#8b5cf6'
              },
              {
                title: 'Тестов',
                value: statistics.total_tests,
                icon: '📝',
                gradient: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)',
                color: '#ec4899'
              },
              {
                title: 'Попыток тестирования',
                value: statistics.total_test_attempts,
                icon: '🎯',
                gradient: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                color: '#14b8a6'
              },
              {
                title: 'Процент успешных',
                value: `${statistics.pass_rate}%`,
                icon: '✅',
                gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#f59e0b'
              }
            ].map((stat, index) => (
              <div
                key={stat.title}
                style={{
                  background: 'var(--bg-card)',
                  padding: '2rem',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  animation: `slideIn 0.3s ease-out ${index * 0.1}s backwards`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${stat.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  fontSize: '6rem',
                  opacity: 0.1
                }}>
                  {stat.icon}
                </div>

                <h3 style={{
                  marginTop: 0,
                  marginBottom: '1rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {stat.title}
                </h3>

                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  background: stat.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem'
                }}>
                  {stat.value}
                </div>

                <div style={{
                  fontSize: '1.5rem',
                  marginBottom: '0.5rem'
                }}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{
            background: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                marginTop: 0,
                marginBottom: 0,
                color: 'var(--text-primary)',
                fontSize: '1.8rem'
              }}>
                👥 Управление пользователями
              </h2>
              <button
                onClick={() => setShowUserForm(!showUserForm)}
                style={{
                  padding: '0.875rem 1.5rem',
                  background: showUserForm ? 'var(--bg-primary)' : 'var(--gradient-success)',
                  color: 'white',
                  border: showUserForm ? '2px solid rgba(255,255,255,0.2)' : 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  boxShadow: showUserForm ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!showUserForm) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showUserForm) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                  }
                }}
              >
                {showUserForm ? '✕ Отмена' : '+ Добавить пользователя'}
              </button>
            </div>

            {showUserForm && (
              <form
                onSubmit={handleCreateUser}
                style={{
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  background: 'var(--bg-primary)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  animation: 'slideIn 0.3s ease-out'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  <input
                    type="text"
                    placeholder="Фамилия"
                    value={userFormData.last_name}
                    onChange={(e) => setUserFormData({ ...userFormData, last_name: e.target.value })}
                    required
                    style={{
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-card)',
                      border: '2px solid transparent',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                  <input
                    type="text"
                    placeholder="Имя"
                    value={userFormData.first_name}
                    onChange={(e) => setUserFormData({ ...userFormData, first_name: e.target.value })}
                    required
                    style={{
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-card)',
                      border: '2px solid transparent',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                  <input
                    type="text"
                    placeholder="Отчество (необязательно)"
                    value={userFormData.middle_name}
                    onChange={(e) => setUserFormData({ ...userFormData, middle_name: e.target.value })}
                    style={{
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-card)',
                      border: '2px solid transparent',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    required
                    style={{
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-card)',
                      border: '2px solid transparent',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                  <input
                    type="password"
                    placeholder="Пароль"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    required
                    style={{
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-card)',
                      border: '2px solid transparent',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    style={{
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-card)',
                      border: '2px solid transparent',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="student">Студент</option>
                    <option value="teacher">Преподаватель</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
                <button
                  type="submit"
                  style={{
                    marginTop: '1rem',
                    padding: '0.875rem 1.5rem',
                    background: 'var(--gradient-success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  ✓ Создать пользователя
                </button>
              </form>
            )}

            {loading ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid rgba(255,255,255,0.1)',
                  borderTop: '4px solid #f59e0b',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }} />
                Загрузка...
              </div>
            ) : users.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
                <p>Нет пользователей</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: '0 0.5rem'
                }}>
                  <thead>
                    <tr style={{
                      background: 'var(--bg-primary)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      <th style={{
                        padding: '1rem',
                        textAlign: 'left',
                        borderTopLeftRadius: '10px',
                        borderBottomLeftRadius: '10px'
                      }}>ФИО</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Роль</th>
                      <th style={{
                        padding: '1rem',
                        textAlign: 'left',
                        borderTopRightRadius: '10px',
                        borderBottomRightRadius: '10px'
                      }}>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr
                        key={user.id}
                        style={{
                          background: 'var(--bg-primary)',
                          transition: 'all 0.2s ease',
                          animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                          e.currentTarget.style.transform = 'scale(1.01)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--bg-primary)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <td style={{
                          padding: '1.25rem 1rem',
                          color: 'var(--text-primary)',
                          borderTopLeftRadius: '10px',
                          borderBottomLeftRadius: '10px',
                          fontWeight: '500'
                        }}>
                          👤 {user.last_name} {user.first_name} {user.middle_name || ''}
                        </td>
                        <td style={{
                          padding: '1.25rem 1rem',
                          color: 'var(--text-primary)'
                        }}>
                          {user.email}
                        </td>
                        <td style={{ padding: '1.25rem 1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            borderRadius: '10px',
                            background: user.role === 'admin' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : user.role === 'teacher' ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' : 'var(--gradient-success)',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '0.9rem'
                          }}>
                            {user.role === 'admin' ? '👑 Админ' : user.role === 'teacher' ? '👨‍🏫 Препод' : '🎓 Студент'}
                          </span>
                        </td>
                        <td style={{
                          padding: '1.25rem 1rem',
                          borderTopRightRadius: '10px',
                          borderBottomRightRadius: '10px'
                        }}>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#ef4444',
                              border: '2px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '700',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            🗑️ Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div style={{
            background: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                marginTop: 0,
                marginBottom: 0,
                color: 'var(--text-primary)',
                fontSize: '1.8rem'
              }}>
                📚 Управление курсами
              </h2>
              <button
                onClick={() => setShowCourseForm(!showCourseForm)}
                style={{
                  padding: '0.875rem 1.5rem',
                  background: showCourseForm ? 'var(--bg-primary)' : 'var(--gradient-success)',
                  color: 'white',
                  border: showCourseForm ? '2px solid rgba(255,255,255,0.2)' : 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  boxShadow: showCourseForm ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!showCourseForm) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showCourseForm) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                  }
                }}
              >
                {showCourseForm ? '✕ Отмена' : '+ Добавить курс'}
              </button>
            </div>

            {showCourseForm && (
              <form
                onSubmit={handleCreateCourse}
                style={{
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  background: 'var(--bg-primary)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  animation: 'slideIn 0.3s ease-out'
                }}
              >
                <input
                  type="text"
                  placeholder="Название курса"
                  value={courseFormData.name}
                  onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    background: 'var(--bg-card)',
                    border: '2px solid transparent',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    marginBottom: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
                <textarea
                  placeholder="Описание курса"
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    background: 'var(--bg-card)',
                    border: '2px solid transparent',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    marginBottom: '1rem',
                    minHeight: '100px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.875rem 1.5rem',
                    background: 'var(--gradient-success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  ✓ Создать курс
                </button>
              </form>
            )}

            {loading ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid rgba(255,255,255,0.1)',
                  borderTop: '4px solid #f59e0b',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }} />
                Загрузка...
              </div>
            ) : courses.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
                <p>Нет курсов</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '1.5rem',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
              }}>
                {courses.map((course, index) => (
                  <div
                    key={course.id}
                    style={{
                      padding: '2rem',
                      background: 'var(--bg-primary)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.3s ease',
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(245, 158, 11, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    }}
                  >
                    <h3 style={{
                      marginTop: 0,
                      marginBottom: '1rem',
                      color: 'var(--text-primary)',
                      fontSize: '1.3rem'
                    }}>
                      {course.name}
                    </h3>
                    <p style={{
                      color: 'var(--text-secondary)',
                      marginBottom: '1.5rem',
                      lineHeight: '1.6'
                    }}>
                      {course.description}
                    </p>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      style={{
                        padding: '0.75rem 1.25rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        border: '2px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: '700',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
