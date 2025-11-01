import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { teacherAPI } from '../services/api';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('tests');
  const [tests, setTests] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);
  const [testFormData, setTestFormData] = useState({
    title: '',
    description: '',
    time_limit: '',
    passing_score: 60,
    questions: [
      {
        question_text: '',
        question_type: 'single_choice',
        points: 1,
        order: 0,
        answers: [
          { answer_text: '', is_correct: false, order: 0 },
          { answer_text: '', is_correct: false, order: 1 },
        ],
      },
    ],
  });
  const [selectedTestResults, setSelectedTestResults] = useState(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    if (activeTab === 'tests') {
      loadTests();
    } else if (activeTab === 'statistics') {
      loadStatistics();
    } else if (activeTab === 'performance') {
      loadPerformance();
    }
  }, [activeTab]);

  const loadTests = async () => {
    setLoading(true);
    try {
      const response = await teacherAPI.getTests();
      setTests(response.data);
    } catch (error) {
      console.error('Failed to load tests:', error);
    }
    setLoading(false);
  };

  const loadStatistics = async () => {
    try {
      const response = await teacherAPI.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const loadPerformance = async () => {
    setLoading(true);
    try {
      const response = await teacherAPI.getStudentsPerformance();
      setPerformance(response.data);
    } catch (error) {
      console.error('Failed to load performance:', error);
    }
    setLoading(false);
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    try {
      await teacherAPI.createTest(testFormData);
      setShowTestForm(false);
      resetTestForm();
      loadTests();
      alert('Тест успешно создан! ✓');
    } catch (error) {
      alert('Ошибка при создании теста');
    }
  };

  const handleDeleteTest = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот тест?')) return;

    try {
      await teacherAPI.deleteTest(id);
      loadTests();
      alert('Тест удален ✓');
    } catch (error) {
      alert('Ошибка при удалении теста');
    }
  };

  const viewTestResults = async (testId) => {
    try {
      const response = await teacherAPI.getTestResults(testId);
      setSelectedTestResults({ testId, results: response.data });
    } catch (error) {
      alert('Ошибка при загрузке результатов');
    }
  };

  const resetTestForm = () => {
    setTestFormData({
      title: '',
      description: '',
      time_limit: '',
      passing_score: 60,
      questions: [
        {
          question_text: '',
          question_type: 'single_choice',
          points: 1,
          order: 0,
          answers: [
            { answer_text: '', is_correct: false, order: 0 },
            { answer_text: '', is_correct: false, order: 1 },
          ],
        },
      ],
    });
  };

  const addQuestion = () => {
    setTestFormData({
      ...testFormData,
      questions: [
        ...testFormData.questions,
        {
          question_text: '',
          question_type: 'single_choice',
          points: 1,
          order: testFormData.questions.length,
          answers: [
            { answer_text: '', is_correct: false, order: 0 },
            { answer_text: '', is_correct: false, order: 1 },
          ],
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = testFormData.questions.filter((_, i) => i !== index);
    setTestFormData({ ...testFormData, questions: newQuestions });
  };

  const updateQuestion = (questionIndex, field, value) => {
    const newQuestions = [...testFormData.questions];
    newQuestions[questionIndex][field] = value;
    setTestFormData({ ...testFormData, questions: newQuestions });
  };

  const addAnswer = (questionIndex) => {
    const newQuestions = [...testFormData.questions];
    newQuestions[questionIndex].answers.push({
      answer_text: '',
      is_correct: false,
      order: newQuestions[questionIndex].answers.length,
    });
    setTestFormData({ ...testFormData, questions: newQuestions });
  };

  const removeAnswer = (questionIndex, answerIndex) => {
    const newQuestions = [...testFormData.questions];
    newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.filter((_, i) => i !== answerIndex);
    setTestFormData({ ...testFormData, questions: newQuestions });
  };

  const updateAnswer = (questionIndex, answerIndex, field, value) => {
    const newQuestions = [...testFormData.questions];
    newQuestions[questionIndex].answers[answerIndex][field] = value;
    setTestFormData({ ...testFormData, questions: newQuestions });
  };

  // Filter tests
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
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700'
          }}>
            👨‍🏫 Панель преподавателя
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem'
          }}>
            Управление тестами и отслеживание успеваемости
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
            { id: 'tests', label: 'Мои тесты', icon: '📝' },
            { id: 'statistics', label: 'Статистика', icon: '📊' },
            { id: 'performance', label: 'Успеваемость', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 2rem',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' : 'var(--bg-card)',
                color: 'white',
                border: activeTab === tab.id ? 'none' : '2px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(139, 92, 246, 0.4)' : 'none',
                minWidth: '180px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)';
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

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Search and Create Button */}
            <div style={{
              marginBottom: '2rem',
              background: 'var(--bg-card)',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: '1rem',
                alignItems: 'center'
              }}>
                {/* Search Bar */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="🔍 Поиск тестов..."
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
                      e.target.style.borderColor = '#8b5cf6';
                      e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'transparent';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Date Filter */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[
                    { id: 'all', label: 'Все', icon: '📅' },
                    { id: 'week', label: 'Неделя', icon: '📆' },
                    { id: 'month', label: 'Месяц', icon: '🗓️' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setDateFilter(filter.id)}
                      style={{
                        padding: '0.75rem 1rem',
                        background: dateFilter === filter.id ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' : 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        border: '2px solid transparent',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: dateFilter === filter.id ? '600' : '400',
                        transition: 'all 0.2s ease',
                        boxShadow: dateFilter === filter.id ? '0 2px 8px rgba(139, 92, 246, 0.3)' : 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {filter.icon} {filter.label}
                    </button>
                  ))}
                </div>

                {/* Create Test Button */}
                <button
                  onClick={() => setShowTestForm(!showTestForm)}
                  style={{
                    padding: '0.875rem 1.5rem',
                    background: showTestForm ? 'var(--bg-primary)' : 'var(--gradient-success)',
                    color: 'white',
                    border: showTestForm ? '2px solid rgba(255,255,255,0.2)' : 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    boxShadow: showTestForm ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!showTestForm) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showTestForm) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                    }
                  }}
                >
                  {showTestForm ? '✕ Отмена' : '+ Создать тест'}
                </button>
              </div>
            </div>

            {/* Test Creation Form */}
            {showTestForm && (
              <form
                onSubmit={handleCreateTest}
                style={{
                  marginBottom: '2rem',
                  background: 'var(--bg-card)',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  animation: 'slideIn 0.3s ease-out'
                }}
              >
                <h3 style={{
                  marginTop: 0,
                  marginBottom: '1.5rem',
                  color: 'var(--text-primary)',
                  fontSize: '1.5rem'
                }}>
                  ✨ Новый тест
                </h3>

                {/* Basic Info */}
                <div style={{ marginBottom: '2rem' }}>
                  <input
                    type="text"
                    placeholder="Название теста"
                    value={testFormData.title}
                    onChange={(e) => setTestFormData({ ...testFormData, title: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-primary)',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                  <textarea
                    placeholder="Описание теста"
                    value={testFormData.description}
                    onChange={(e) => setTestFormData({ ...testFormData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-primary)',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      minHeight: '100px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <input
                    type="number"
                    placeholder="Время (минуты, необязательно)"
                    value={testFormData.time_limit}
                    onChange={(e) => setTestFormData({ ...testFormData, time_limit: e.target.value })}
                    style={{
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-primary)',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                  <input
                    type="number"
                    placeholder="Проходной балл (%)"
                    value={testFormData.passing_score}
                    onChange={(e) => setTestFormData({ ...testFormData, passing_score: parseInt(e.target.value) })}
                    required
                    min="0"
                    max="100"
                    style={{
                      padding: '0.875rem 1rem',
                      background: 'var(--bg-primary)',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                </div>

                {/* Questions */}
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Вопросы:</h4>
                {testFormData.questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    style={{
                      marginBottom: '1.5rem',
                      padding: '1.5rem',
                      background: 'var(--bg-primary)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <h5 style={{ color: 'var(--text-primary)', margin: 0 }}>
                        Вопрос {qIndex + 1}
                      </h5>
                      {testFormData.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(0.95)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          🗑️ Удалить
                        </button>
                      )}
                    </div>

                    <textarea
                      placeholder="Текст вопроса"
                      value={question.question_text}
                      onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        background: 'var(--bg-card)',
                        border: '2px solid transparent',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        color: 'var(--text-primary)',
                        marginBottom: '1rem',
                        minHeight: '80px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        resize: 'vertical'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    />

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <select
                        value={question.question_type}
                        onChange={(e) => updateQuestion(qIndex, 'question_type', e.target.value)}
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
                        <option value="single_choice">Один вариант</option>
                        <option value="multiple_choice">Несколько вариантов</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Баллы"
                        value={question.points}
                        onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                        required
                        min="1"
                        style={{
                          padding: '0.875rem 1rem',
                          background: 'var(--bg-card)',
                          border: '2px solid transparent',
                          borderRadius: '10px',
                          color: 'var(--text-primary)',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <h6 style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      Варианты ответов:
                    </h6>
                    {question.answers.map((answer, aIndex) => (
                      <div
                        key={aIndex}
                        style={{
                          display: 'flex',
                          gap: '0.75rem',
                          marginBottom: '0.75rem',
                          alignItems: 'center'
                        }}
                      >
                        <input
                          type="text"
                          placeholder={`Ответ ${aIndex + 1}`}
                          value={answer.answer_text}
                          onChange={(e) => updateAnswer(qIndex, aIndex, 'answer_text', e.target.value)}
                          required
                          style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            background: 'var(--bg-card)',
                            border: '2px solid transparent',
                            borderRadius: '10px',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                          onBlur={(e) => e.target.style.borderColor = 'transparent'}
                        />
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                          padding: '0.75rem 1rem',
                          background: answer.is_correct ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease'
                        }}>
                          <input
                            type="checkbox"
                            checked={answer.is_correct}
                            onChange={(e) => updateAnswer(qIndex, aIndex, 'is_correct', e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          <span style={{ fontWeight: answer.is_correct ? '600' : '400' }}>
                            {answer.is_correct ? '✓ Верный' : 'Верный'}
                          </span>
                        </label>
                        {question.answers.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeAnswer(qIndex, aIndex)}
                            style={{
                              padding: '0.75rem',
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#ef4444',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.3)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addAnswer(qIndex)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#8b5cf6',
                        border: '2px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        marginTop: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(139, 92, 246, 0.3)';
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(139, 92, 246, 0.2)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      + Добавить ответ
                    </button>
                  </div>
                ))}

                {/* Form Actions */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1.5rem'
                }}>
                  <button
                    type="button"
                    onClick={addQuestion}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)';
                    }}
                  >
                    + Добавить вопрос
                  </button>

                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '1rem',
                      background: 'var(--gradient-success)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
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
                    ✓ Создать тест
                  </button>
                </div>
              </form>
            )}

            {/* Tests List */}
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
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {searchQuery ? 'Тесты не найдены' : 'У вас пока нет тестов'}
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Создайте свой первый тест!'}
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
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 92, 246, 0.3)';
                      e.currentTarget.style.borderColor = '#8b5cf6';
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
                      fontSize: '1.3rem'
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
                      <span>📝 {test.questions?.length || 0} вопросов</span>
                      <span>•</span>
                      <span>✅ {test.passing_score}%</span>
                      {test.time_limit && (
                        <>
                          <span>•</span>
                          <span>⏱️ {test.time_limit} мин</span>
                        </>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => viewTestResults(test.id)}
                        style={{
                          flex: 1,
                          padding: '0.875rem',
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontWeight: '700',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        📊 Результаты
                      </button>
                      <button
                        onClick={() => handleDeleteTest(test.id)}
                        style={{
                          padding: '0.875rem 1rem',
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
                          e.target.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Test Results Modal */}
            {selectedTestResults && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                animation: 'fadeIn 0.3s ease-out',
                padding: '20px'
              }}
              onClick={() => setSelectedTestResults(null)}
              >
                <div
                  style={{
                    background: 'var(--bg-card)',
                    padding: '2rem',
                    borderRadius: '16px',
                    maxWidth: '900px',
                    width: '100%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    border: '1px solid rgba(255,255,255,0.1)',
                    animation: 'scaleIn 0.3s ease-out'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <h3 style={{
                      color: 'var(--text-primary)',
                      margin: 0,
                      fontSize: '1.5rem'
                    }}>
                      📊 Результаты теста
                    </h3>
                    <button
                      onClick={() => setSelectedTestResults(null)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        border: '2px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                      onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    >
                      ✕ Закрыть
                    </button>
                  </div>

                  {selectedTestResults.results.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
                      <p>Пока нет результатов для этого теста</p>
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
                            }}>Студент</th>
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
                          {selectedTestResults.results.map((result, index) => (
                            <tr
                              key={result.id}
                              style={{
                                background: 'var(--bg-primary)',
                                transition: 'all 0.2s ease',
                                animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
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
                                👤 ID: {result.student_id}
                              </td>
                              <td style={{
                                padding: '1.25rem 1rem',
                                color: 'var(--text-primary)'
                              }}>
                                <div style={{
                                  display: 'inline-block',
                                  padding: '0.5rem 1rem',
                                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                                  borderRadius: '8px',
                                  fontWeight: '600'
                                }}>
                                  {result.score.toFixed(0)}%
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
                                  {result.passed ? '✓ Сдал' : '✗ Не сдал'}
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
              </div>
            )}
          </div>
        )}

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
                title: 'Создано тестов',
                value: statistics.total_tests,
                icon: '📝',
                gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                color: '#8b5cf6'
              },
              {
                title: 'Попыток прохождения',
                value: statistics.total_attempts,
                icon: '🎯',
                gradient: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                color: '#6366f1'
              },
              {
                title: 'Процент успешных',
                value: `${statistics.pass_rate}%`,
                icon: '✅',
                gradient: 'var(--gradient-success)',
                color: '#10b981'
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
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
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
              📈 Успеваемость студентов
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
                  borderTop: '4px solid #8b5cf6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }} />
                Загрузка...
              </div>
            ) : performance.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
                <p>Пока нет данных об успеваемости</p>
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
                      }}>Студент</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Тест</th>
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
                    {performance.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          background: 'var(--bg-primary)',
                          transition: 'all 0.2s ease',
                          animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
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
                          👤 {item.student_name}
                        </td>
                        <td style={{
                          padding: '1.25rem 1rem',
                          color: 'var(--text-primary)'
                        }}>
                          {item.test_title}
                        </td>
                        <td style={{
                          padding: '1.25rem 1rem',
                          color: 'var(--text-primary)'
                        }}>
                          <div style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                            borderRadius: '8px',
                            fontWeight: '600'
                          }}>
                            {item.score.toFixed(0)}%
                          </div>
                        </td>
                        <td style={{ padding: '1.25rem 1rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            borderRadius: '10px',
                            background: item.passed ? 'var(--gradient-success)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '0.9rem'
                          }}>
                            {item.passed ? '✓ Сдал' : '✗ Не сдал'}
                          </span>
                        </td>
                        <td style={{
                          padding: '1.25rem 1rem',
                          color: 'var(--text-secondary)',
                          borderTopRightRadius: '10px',
                          borderBottomRightRadius: '10px'
                        }}>
                          {new Date(item.completed_at).toLocaleString('ru-RU', {
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
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
