import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { studentAPI } from '../services/api';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('tests');
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTest, setActiveTest] = useState(null);
  const [testAnswers, setTestAnswers] = useState({});
  const [testStartTime, setTestStartTime] = useState(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'

  useEffect(() => {
    if (activeTab === 'tests') {
      loadTests();
    } else if (activeTab === 'results') {
      loadResults();
    } else if (activeTab === 'statistics') {
      loadStatistics();
    }
  }, [activeTab]);

  const loadTests = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getTests();
      setTests(response.data);
    } catch (error) {
      console.error('Failed to load tests:', error);
    }
    setLoading(false);
  };

  const loadResults = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getMyResults();
      setResults(response.data);
    } catch (error) {
      console.error('Failed to load results:', error);
    }
    setLoading(false);
  };

  const loadStatistics = async () => {
    try {
      const response = await studentAPI.getMyStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const startTest = async (testId) => {
    try {
      const response = await studentAPI.getTest(testId);
      setActiveTest(response.data);
      setTestStartTime(new Date());
      setTestAnswers({});
    } catch (error) {
      alert('Ошибка при загрузке теста');
    }
  };

  const handleAnswerChange = (questionId, answerId, isMultiple) => {
    if (isMultiple) {
      const currentAnswers = testAnswers[questionId] || [];
      const newAnswers = currentAnswers.includes(answerId)
        ? currentAnswers.filter(id => id !== answerId)
        : [...currentAnswers, answerId];
      setTestAnswers({ ...testAnswers, [questionId]: newAnswers });
    } else {
      setTestAnswers({ ...testAnswers, [questionId]: answerId });
    }
  };

  const submitTest = async () => {
    if (!confirm('Вы уверены, что хотите отправить ответы?')) return;

    try {
      const response = await studentAPI.submitTest(activeTest.id, {
        test_id: activeTest.id,
        answers: testAnswers,
        started_at: testStartTime.toISOString(),
      });

      alert(`Тест завершен! Ваш результат: ${response.data.score.toFixed(2)}% (${response.data.passed ? 'Сдано' : 'Не сдано'})`);
      setActiveTest(null);
      setTestAnswers({});
      setActiveTab('results');
    } catch (error) {
      alert('Ошибка при отправке ответов');
    }
  };

  // Filter and search logic
  const getFilteredTests = () => {
    let filtered = tests;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(test =>
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (dateFilter !== 'all') {
      filtered = filtered.filter(test => {
        const testDate = new Date(test.created_at);
        if (dateFilter === 'today') return testDate >= today;
        if (dateFilter === 'week') return testDate >= weekAgo;
        if (dateFilter === 'month') return testDate >= monthAgo;
        return true;
      });
    }

    return filtered;
  };

  const getFilteredResults = () => {
    let filtered = results;

    // Date filter for results
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (dateFilter !== 'all') {
      filtered = filtered.filter(result => {
        const resultDate = new Date(result.completed_at);
        if (dateFilter === 'today') return resultDate >= today;
        if (dateFilter === 'week') return resultDate >= weekAgo;
        if (dateFilter === 'month') return resultDate >= monthAgo;
        return true;
      });
    }

    return filtered;
  };

  // Test Taking View
  if (activeTest) {
    return (
      <Layout>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            padding: '2.5rem',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Test Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '2rem',
              paddingBottom: '1.5rem',
              borderBottom: '2px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  marginTop: 0,
                  marginBottom: '0.5rem',
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '1.8rem'
                }}>
                  {activeTest.title}
                </h2>
                <p style={{
                  margin: 0,
                  color: 'var(--text-secondary)',
                  fontSize: '1rem'
                }}>
                  {activeTest.description}
                </p>
              </div>
              <div style={{
                textAlign: 'right',
                background: 'var(--bg-primary)',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                marginLeft: '2rem'
              }}>
                {activeTest.time_limit && (
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem'
                  }}>
                    ⏱️ Время: {activeTest.time_limit} минут
                  </div>
                )}
                <div style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)'
                }}>
                  ✅ Проходной балл: {activeTest.passing_score}%
                </div>
              </div>
            </div>

            {/* Questions */}
            {activeTest.questions.map((question, qIndex) => (
              <div
                key={question.id}
                style={{
                  marginBottom: '2rem',
                  padding: '2rem',
                  background: 'var(--bg-primary)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  animation: `slideIn 0.3s ease-out ${qIndex * 0.05}s backwards`
                }}
              >
                <h4 style={{
                  marginTop: 0,
                  marginBottom: '1rem',
                  color: 'var(--text-primary)',
                  fontSize: '1.1rem'
                }}>
                  Вопрос {qIndex + 1}{' '}
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    background: 'var(--gradient-primary)',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    marginLeft: '0.5rem'
                  }}>
                    {question.points} {question.points === 1 ? 'балл' : 'баллов'}
                  </span>
                </h4>
                <p style={{
                  marginBottom: '1.5rem',
                  fontSize: '1.1rem',
                  color: 'var(--text-primary)',
                  lineHeight: '1.6'
                }}>
                  {question.question_text}
                </p>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {question.answers.map((answer) => {
                    const isSelected = question.question_type === 'multiple_choice'
                      ? (testAnswers[question.id] || []).includes(answer.id)
                      : testAnswers[question.id] === answer.id;

                    return (
                      <label
                        key={answer.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '1rem 1.25rem',
                          background: isSelected ? 'rgba(102, 126, 234, 0.15)' : 'var(--bg-card)',
                          border: `2px solid ${isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }
                        }}
                      >
                        <input
                          type={question.question_type === 'multiple_choice' ? 'checkbox' : 'radio'}
                          name={`question_${question.id}`}
                          value={answer.id}
                          checked={isSelected}
                          onChange={() =>
                            handleAnswerChange(
                              question.id,
                              answer.id,
                              question.question_type === 'multiple_choice'
                            )
                          }
                          style={{
                            marginRight: '1rem',
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{
                          color: 'var(--text-primary)',
                          fontSize: '1rem'
                        }}>
                          {answer.answer_text}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {question.question_type === 'multiple_choice' && (
                  <div style={{
                    marginTop: '0.75rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic'
                  }}>
                    💡 Можно выбрать несколько вариантов
                  </div>
                )}
              </div>
            ))}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              marginTop: '2.5rem'
            }}>
              <button
                onClick={() => {
                  if (confirm('Вы уверены, что хотите выйти? Ответы не будут сохранены.')) {
                    setActiveTest(null);
                    setTestAnswers({});
                  }
                }}
                style={{
                  padding: '1rem 2rem',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  border: '2px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
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
                Отмена
              </button>
              <button
                onClick={submitTest}
                style={{
                  padding: '1rem 2rem',
                  background: 'var(--gradient-success)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
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
                Отправить ответы 📤
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Main Dashboard View
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
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700'
          }}>
            🎓 Панель студента
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem'
          }}>
            Добро пожаловать! Выберите тест для прохождения
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
            { id: 'tests', label: 'Доступные тесты', icon: '📝' },
            { id: 'results', label: 'Мои результаты', icon: '📊' },
            { id: 'statistics', label: 'Статистика', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 2rem',
                background: activeTab === tab.id ? 'var(--gradient-primary)' : 'var(--bg-card)',
                color: 'white',
                border: activeTab === tab.id ? 'none' : '2px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
                minWidth: '180px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
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

        {/* Search and Filters */}
        {(activeTab === 'tests' || activeTab === 'results') && (
          <div style={{
            marginBottom: '2rem',
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: activeTab === 'tests' ? '1fr auto' : 'auto',
              gap: '1rem',
              alignItems: 'center'
            }}>
              {/* Search Bar (only for tests) */}
              {activeTab === 'tests' && (
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="🔍 Поиск тестов по названию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem 0.875rem 2.75rem',
                      background: 'var(--bg-primary)',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'transparent';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1.2rem'
                  }}>
                    🔍
                  </div>
                </div>
              )}

              {/* Date Filter */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                {[
                  { id: 'all', label: 'Все', icon: '📅' },
                  { id: 'today', label: 'Сегодня', icon: '📍' },
                  { id: 'week', label: 'Неделя', icon: '📆' },
                  { id: 'month', label: 'Месяц', icon: '🗓️' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setDateFilter(filter.id)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      background: dateFilter === filter.id ? 'var(--gradient-primary)' : 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      border: '2px solid transparent',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: dateFilter === filter.id ? '600' : '400',
                      transition: 'all 0.2s ease',
                      boxShadow: dateFilter === filter.id ? '0 2px 8px rgba(102, 126, 234, 0.3)' : 'none',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      if (dateFilter !== filter.id) {
                        e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (dateFilter !== filter.id) {
                        e.target.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    {filter.icon} {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div>
            {loading ? (
              <div style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
              }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--bg-card)',
                      padding: '2rem',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                  >
                    <div style={{
                      height: '24px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      marginBottom: '1rem'
                    }} />
                    <div style={{
                      height: '16px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      marginBottom: '1.5rem',
                      width: '80%'
                    }} />
                    <div style={{
                      height: '40px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px'
                    }} />
                  </div>
                ))}
              </div>
            ) : getFilteredTests().length === 0 ? (
              <div style={{
                background: 'var(--bg-card)',
                padding: '4rem 2rem',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                animation: 'fadeIn 0.5s ease-out'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {searchQuery ? 'Тесты не найдены' : 'Нет доступных тестов'}
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Новые тесты скоро появятся'}
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '1.5rem',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
              }}>
                {getFilteredTests().map((test, index) => (
                  <div
                    key={test.id}
                    style={{
                      background: 'var(--bg-card)',
                      padding: '2rem',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.3)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <h3 style={{
                      marginTop: 0,
                      marginBottom: '0.75rem',
                      color: 'var(--text-primary)',
                      fontSize: '1.3rem',
                      fontWeight: '600'
                    }}>
                      {test.title}
                    </h3>
                    <p style={{
                      color: 'var(--text-secondary)',
                      marginBottom: '1.5rem',
                      lineHeight: '1.5',
                      minHeight: '3em'
                    }}>
                      {test.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '1.5rem',
                      padding: '1rem',
                      background: 'var(--bg-primary)',
                      borderRadius: '10px'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        📝 {test.questions?.length || 0} вопросов
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        ✅ {test.passing_score}%
                      </span>
                      {test.time_limit && (
                        <>
                          <span>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            ⏱️ {test.time_limit} мин
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => startTest(test.id)}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '700',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.02)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                      }}
                    >
                      Начать тест →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div style={{
            background: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <h2 style={{
              marginTop: 0,
              marginBottom: '2rem',
              color: 'var(--text-primary)',
              fontSize: '1.8rem'
            }}>
              📊 Мои результаты
            </h2>

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
                  borderTop: '4px solid var(--primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }} />
                Загрузка...
              </div>
            ) : getFilteredResults().length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
                <p>Вы еще не проходили тесты</p>
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
                      }}>Тест</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Балл</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Результат</th>
                      <th style={{
                        padding: '1rem',
                        textAlign: 'left',
                        borderTopRightRadius: '10px',
                        borderBottomRightRadius: '10px'
                      }}>Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredResults().map((result, index) => (
                      <tr
                        key={result.id}
                        style={{
                          background: 'var(--bg-primary)',
                          transition: 'all 0.2s ease',
                          animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
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
                          📝 Тест #{result.test_id}
                        </td>
                        <td style={{
                          padding: '1.25rem 1rem',
                          color: 'var(--text-primary)'
                        }}>
                          <div style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            background: 'var(--gradient-primary)',
                            borderRadius: '8px',
                            fontWeight: '600'
                          }}>
                            {result.score.toFixed(0)}%
                          </div>
                          <div style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                            marginTop: '0.25rem'
                          }}>
                            ({result.earned_score}/{result.max_score})
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            borderRadius: '10px',
                            background: result.passed ? 'var(--gradient-success)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '0.9rem'
                          }}>
                            {result.passed ? '✓ Сдано' : '✗ Не сдано'}
                          </span>
                        </td>
                        <td style={{
                          padding: '1.25rem 1rem',
                          color: 'var(--text-secondary)',
                          borderTopRightRadius: '10px',
                          borderBottomRightRadius: '10px'
                        }}>
                          {new Date(result.completed_at).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && statistics && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h2 style={{
              marginBottom: '2rem',
              color: 'var(--text-primary)',
              fontSize: '1.8rem',
              textAlign: 'center'
            }}>
              📈 Моя статистика
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {[
                {
                  title: 'Всего тестов',
                  value: statistics.total_tests,
                  icon: '📝',
                  gradient: 'var(--gradient-primary)',
                  color: '#6366f1'
                },
                {
                  title: 'Сдано',
                  value: statistics.passed_tests,
                  icon: '✅',
                  gradient: 'var(--gradient-success)',
                  color: '#10b981'
                },
                {
                  title: 'Не сдано',
                  value: statistics.failed_tests,
                  icon: '❌',
                  gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ef4444'
                },
                {
                  title: 'Средний балл',
                  value: `${statistics.average_score}%`,
                  icon: '⭐',
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentDashboard;
