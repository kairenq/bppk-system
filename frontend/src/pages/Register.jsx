import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Register = () => {
  const [step, setStep] = useState(1); // 1: Personal Info, 2: Account Info
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    last_name: '',
    first_name: '',
    middle_name: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error on input
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.last_name || !formData.first_name) {
      setError('Пожалуйста, заполните обязательные поля');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  // Success Screen
  if (success) {
    return (
      <Layout>
        <div style={{
          minHeight: 'calc(100vh - 140px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            background: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '3rem',
            textAlign: 'center',
            animation: 'scaleIn 0.5s ease-out',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 2rem',
              background: 'var(--gradient-success)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              animation: 'scaleIn 0.6s ease-out',
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)'
            }}>
              ✓
            </div>
            <h2 style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              background: 'var(--gradient-success)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Регистрация успешна! 🎉
            </h2>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.1rem'
            }}>
              Переход на страницу входа...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{
        minHeight: 'calc(100vh - 140px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '550px',
          width: '100%',
          background: 'var(--bg-card)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          animation: 'fadeIn 0.5s ease-out',
          position: 'relative'
        }}>
          {/* Shimmer effect border */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
            animation: 'shimmer 2s infinite'
          }} />

          <div style={{ padding: '3rem' }}>
            {/* Header with icon */}
            <div style={{
              textAlign: 'center',
              marginBottom: '2.5rem'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                background: 'var(--gradient-success)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                ✨
              </div>
              <h2 style={{
                fontSize: '2rem',
                marginBottom: '0.5rem',
                background: 'var(--gradient-success)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '700'
              }}>
                Создать аккаунт
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem'
              }}>
                Присоединяйтесь к системе BPPK
              </p>
            </div>

            {/* Progress Indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '25%',
                right: '25%',
                height: '2px',
                background: step === 2 ? 'var(--gradient-success)' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease'
              }} />

              {[1, 2].map((num) => (
                <div key={num} style={{
                  flex: 1,
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    margin: '0 auto 0.5rem',
                    borderRadius: '50%',
                    background: step >= num ? 'var(--gradient-success)' : 'var(--bg-primary)',
                    border: step >= num ? 'none' : '2px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    boxShadow: step >= num ? '0 4px 15px rgba(16, 185, 129, 0.4)' : 'none'
                  }}>
                    {step > num ? '✓' : num}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: step >= num ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: step === num ? '600' : '400',
                    transition: 'all 0.3s ease'
                  }}>
                    {num === 1 ? 'Личные данные' : 'Аккаунт'}
                  </div>
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--danger)',
                color: 'var(--danger)',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                animation: 'slideIn 0.3s ease-out',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <form onSubmit={handleNextStep} style={{ animation: 'slideIn 0.3s ease-out' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}>
                    Фамилия <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Иванов"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-primary)',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}>
                    Имя <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="Иван"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-primary)',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}>
                    Отчество <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>(необязательно)</span>
                  </label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    placeholder="Иванович"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-primary)',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--gradient-success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
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
                  Далее →
                </button>
              </form>
            )}

            {/* Step 2: Account Information */}
            {step === 2 && (
              <form onSubmit={handleSubmit} style={{ animation: 'slideIn 0.3s ease-out' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}>
                    Email <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@bppk.ru"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-primary)',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}>
                    Пароль <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      placeholder="Минимум 6 символов"
                      style={{
                        width: '100%',
                        padding: '0.875rem 3rem 0.875rem 1rem',
                        background: 'var(--bg-primary)',
                        border: '2px solid transparent',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        color: 'var(--text-primary)',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#10b981';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'transparent';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        opacity: 0.6,
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = '1'}
                      onMouseLeave={(e) => e.target.style.opacity = '0.6'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '1rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}>
                    Выберите роль <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                  }}>
                    {[
                      { value: 'student', label: 'Студент', emoji: '🎓', color: '#3b82f6' },
                      { value: 'teacher', label: 'Преподаватель', emoji: '👨‍🏫', color: '#8b5cf6' }
                    ].map((role) => (
                      <div
                        key={role.value}
                        onClick={() => setFormData({ ...formData, role: role.value })}
                        style={{
                          padding: '1.5rem 1rem',
                          background: formData.role === role.value ? `${role.color}15` : 'var(--bg-primary)',
                          border: `2px solid ${formData.role === role.value ? role.color : 'transparent'}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          textAlign: 'center',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          if (formData.role !== role.value) {
                            e.currentTarget.style.borderColor = `${role.color}50`;
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.role !== role.value) {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                          {role.emoji}
                        </div>
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: formData.role === role.value ? '600' : '400',
                          color: formData.role === role.value ? role.color : 'var(--text-secondary)'
                        }}>
                          {role.label}
                        </div>
                        {formData.role === role.value && (
                          <div style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            width: '20px',
                            height: '20px',
                            background: role.color,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            animation: 'scaleIn 0.3s ease-out'
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr',
                  gap: '1rem'
                }}>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    style={{
                      padding: '1rem',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      border: '2px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    ← Назад
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '1rem',
                      background: loading ? 'var(--bg-primary)' : 'var(--gradient-success)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: loading ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                      }
                    }}
                  >
                    {loading && (
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }} />
                    )}
                    {loading ? 'Создание аккаунта...' : 'Создать аккаунт'}
                  </button>
                </div>
              </form>
            )}

            {/* Login Link */}
            <div style={{
              textAlign: 'center',
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Уже есть аккаунт?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#10b981',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  Войти →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
