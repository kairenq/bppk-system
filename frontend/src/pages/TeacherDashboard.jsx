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
        question_type: 'multiple_choice',
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
      alert('Тест успешно создан');
    } catch (error) {
      alert('Ошибка при создании теста');
    }
  };

  const handleDeleteTest = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот тест?')) return;

    try {
      await teacherAPI.deleteTest(id);
      loadTests();
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
          question_type: 'multiple_choice',
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
          question_type: 'multiple_choice',
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

  const tabStyle = (isActive) => ({
    padding: '1rem 2rem',
    backgroundColor: isActive ? '#3498db' : '#95a5a6',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  });

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>Панель преподавателя</h1>

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <button onClick={() => setActiveTab('tests')} style={tabStyle(activeTab === 'tests')}>
            Мои тесты
          </button>
          <button onClick={() => setActiveTab('statistics')} style={tabStyle(activeTab === 'statistics')}>
            Статистика
          </button>
          <button onClick={() => setActiveTab('performance')} style={tabStyle(activeTab === 'performance')}>
            Успеваемость студентов
          </button>
        </div>

        {activeTab === 'tests' && (
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Управление тестами</h2>
              <button
                onClick={() => setShowTestForm(!showTestForm)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {showTestForm ? 'Отмена' : 'Создать тест'}
              </button>
            </div>

            {showTestForm && (
              <form onSubmit={handleCreateTest} style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h3>Новый тест</h3>
                <input
                  type="text"
                  placeholder="Название теста"
                  value={testFormData.title}
                  onChange={(e) => setTestFormData({ ...testFormData, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem' }}
                />
                <textarea
                  placeholder="Описание"
                  value={testFormData.description}
                  onChange={(e) => setTestFormData({ ...testFormData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem', minHeight: '80px' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="number"
                    placeholder="Время (минуты)"
                    value={testFormData.time_limit}
                    onChange={(e) => setTestFormData({ ...testFormData, time_limit: e.target.value })}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    placeholder="Проходной балл (%)"
                    value={testFormData.passing_score}
                    onChange={(e) => setTestFormData({ ...testFormData, passing_score: parseInt(e.target.value) })}
                    required
                    min="0"
                    max="100"
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>

                <h4>Вопросы:</h4>
                {testFormData.questions.map((question, qIndex) => (
                  <div key={qIndex} style={{ marginBottom: '1.5rem', padding: '1rem', border: '2px solid #dee2e6', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h5>Вопрос {qIndex + 1}</h5>
                      {testFormData.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          style={{ padding: '0.25rem 0.5rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Удалить вопрос
                        </button>
                      )}
                    </div>
                    <textarea
                      placeholder="Текст вопроса"
                      value={question.question_text}
                      onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '0.5rem', minHeight: '60px' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <select
                        value={question.question_type}
                        onChange={(e) => updateQuestion(qIndex, 'question_type', e.target.value)}
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
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
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    </div>

                    <h6>Варианты ответов:</h6>
                    {question.answers.map((answer, aIndex) => (
                      <div key={aIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder={`Ответ ${aIndex + 1}`}
                          value={answer.answer_text}
                          onChange={(e) => updateAnswer(qIndex, aIndex, 'answer_text', e.target.value)}
                          required
                          style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                          <input
                            type="checkbox"
                            checked={answer.is_correct}
                            onChange={(e) => updateAnswer(qIndex, aIndex, 'is_correct', e.target.checked)}
                          />
                          Верный
                        </label>
                        {question.answers.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeAnswer(qIndex, aIndex)}
                            style={{ padding: '0.25rem 0.5rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addAnswer(qIndex)}
                      style={{ padding: '0.25rem 0.75rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}
                    >
                      + Добавить ответ
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addQuestion}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '1rem' }}
                >
                  + Добавить вопрос
                </button>

                <button
                  type="submit"
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Создать тест
                </button>
              </form>
            )}

            {loading ? (
              <p>Загрузка...</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {tests.map((test) => (
                  <div key={test.id} style={{ padding: '1rem', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0 }}>{test.title}</h3>
                    <p>{test.description}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                      <span>Вопросов: {test.questions?.length || 0}</span>
                      <span>•</span>
                      <span>Проходной балл: {test.passing_score}%</span>
                      {test.time_limit && (
                        <>
                          <span>•</span>
                          <span>Время: {test.time_limit} мин</span>
                        </>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => viewTestResults(test.id)}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Результаты
                      </button>
                      <button
                        onClick={() => handleDeleteTest(test.id)}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTestResults && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3>Результаты теста</h3>
                  <button
                    onClick={() => setSelectedTestResults(null)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Закрыть
                  </button>
                </div>
                {selectedTestResults.results.length === 0 ? (
                  <p>Пока нет результатов</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Студент</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Балл</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Результат</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTestResults.results.map((result) => (
                        <tr key={result.id}>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>ID: {result.student_id}</td>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>{result.score.toFixed(2)}%</td>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                            <span style={{ color: result.passed ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                              {result.passed ? 'Сдал' : 'Не сдал'}
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
          </div>
        )}

        {activeTab === 'statistics' && statistics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Создано тестов</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>{statistics.total_tests}</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Попыток прохождения</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9b59b6' }}>{statistics.total_attempts}</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Процент успешных</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>{statistics.pass_rate}%</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Средний балл</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e67e22' }}>{statistics.average_score}%</p>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>Успеваемость студентов</h2>
            {loading ? (
              <p>Загрузка...</p>
            ) : performance.length === 0 ? (
              <p>Пока нет данных об успеваемости</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Студент</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Тест</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Балл</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Результат</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {performance.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>{item.student_name}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>{item.test_title}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>{item.score.toFixed(2)}%</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                        <span style={{ color: item.passed ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                          {item.passed ? 'Сдал' : 'Не сдал'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                        {new Date(item.completed_at).toLocaleString('ru-RU')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
