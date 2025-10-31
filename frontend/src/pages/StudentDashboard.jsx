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

  const tabStyle = (isActive) => ({
    padding: '1rem 2rem',
    backgroundColor: isActive ? '#3498db' : '#95a5a6',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  });

  if (activeTest) {
    return (
      <Layout>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #dee2e6' }}>
              <div>
                <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{activeTest.title}</h2>
                <p style={{ margin: 0, color: '#666' }}>{activeTest.description}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                {activeTest.time_limit && (
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Время: {activeTest.time_limit} минут
                  </div>
                )}
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Проходной балл: {activeTest.passing_score}%
                </div>
              </div>
            </div>

            {activeTest.questions.map((question, qIndex) => (
              <div key={question.id} style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>
                  Вопрос {qIndex + 1} ({question.points} {question.points === 1 ? 'балл' : 'баллов'})
                </h4>
                <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{question.question_text}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {question.answers.map((answer) => (
                    <label
                      key={answer.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        border: '2px solid #dee2e6',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#3498db';
                        e.currentTarget.style.backgroundColor = '#f0f8ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#dee2e6';
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      <input
                        type={question.question_type === 'multiple_choice' ? 'checkbox' : 'radio'}
                        name={`question_${question.id}`}
                        value={answer.id}
                        checked={
                          question.question_type === 'multiple_choice'
                            ? (testAnswers[question.id] || []).includes(answer.id)
                            : testAnswers[question.id] === answer.id
                        }
                        onChange={() =>
                          handleAnswerChange(
                            question.id,
                            answer.id,
                            question.question_type === 'multiple_choice'
                          )
                        }
                        style={{ marginRight: '0.75rem' }}
                      />
                      <span>{answer.answer_text}</span>
                    </label>
                  ))}
                </div>

                {question.question_type === 'multiple_choice' && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                    * Можно выбрать несколько вариантов
                  </div>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                onClick={() => {
                  if (confirm('Вы уверены, что хотите выйти? Ответы не будут сохранены.')) {
                    setActiveTest(null);
                    setTestAnswers({});
                  }
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Отмена
              </button>
              <button
                onClick={submitTest}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                Отправить ответы
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>Панель студента</h1>

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <button onClick={() => setActiveTab('tests')} style={tabStyle(activeTab === 'tests')}>
            Доступные тесты
          </button>
          <button onClick={() => setActiveTab('results')} style={tabStyle(activeTab === 'results')}>
            Мои результаты
          </button>
          <button onClick={() => setActiveTab('statistics')} style={tabStyle(activeTab === 'statistics')}>
            Статистика
          </button>
        </div>

        {activeTab === 'tests' && (
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Доступные тесты</h2>
            {loading ? (
              <p>Загрузка...</p>
            ) : tests.length === 0 ? (
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
                <p>Нет доступных тестов</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {tests.map((test) => (
                  <div key={test.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{test.title}</h3>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>{test.description}</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                      <span>📝 Вопросов: {test.questions?.length || 0}</span>
                      <span>•</span>
                      <span>✅ Проходной балл: {test.passing_score}%</span>
                      {test.time_limit && (
                        <>
                          <span>•</span>
                          <span>⏱️ Время: {test.time_limit} мин</span>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => startTest(test.id)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      Начать тест
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>Мои результаты</h2>
            {loading ? (
              <p>Загрузка...</p>
            ) : results.length === 0 ? (
              <p>Вы еще не проходили тесты</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Тест</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Балл</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Результат</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>Тест #{result.test_id}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                        {result.score.toFixed(2)}% ({result.earned_score}/{result.max_score})
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          backgroundColor: result.passed ? '#d4edda' : '#f8d7da',
                          color: result.passed ? '#155724' : '#721c24',
                          fontWeight: 'bold'
                        }}>
                          {result.passed ? '✓ Сдано' : '✗ Не сдано'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                        {new Date(result.completed_at).toLocaleString('ru-RU')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'statistics' && statistics && (
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Моя статистика</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: 0, color: '#666' }}>Всего тестов</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3498db', margin: 0 }}>{statistics.total_tests}</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: 0, color: '#666' }}>Сдано</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#27ae60', margin: 0 }}>{statistics.passed_tests}</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: 0, color: '#666' }}>Не сдано</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#e74c3c', margin: 0 }}>{statistics.failed_tests}</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: 0, color: '#666' }}>Средний балл</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#9b59b6', margin: 0 }}>{statistics.average_score}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentDashboard;
