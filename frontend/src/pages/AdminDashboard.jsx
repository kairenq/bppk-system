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
      alert('Пользователь успешно создан');
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
      alert('Курс успешно создан');
    } catch (error) {
      alert('Ошибка при создании курса');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот курс?')) return;

    try {
      await adminAPI.deleteCourse(id);
      loadCourses();
    } catch (error) {
      alert('Ошибка при удалении курса');
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

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>Панель администратора</h1>

        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <button onClick={() => setActiveTab('statistics')} style={tabStyle(activeTab === 'statistics')}>
            Статистика
          </button>
          <button onClick={() => setActiveTab('users')} style={tabStyle(activeTab === 'users')}>
            Пользователи
          </button>
          <button onClick={() => setActiveTab('courses')} style={tabStyle(activeTab === 'courses')}>
            Курсы
          </button>
        </div>

        {activeTab === 'statistics' && statistics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Всего пользователей</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>{statistics.total_users}</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Студентов</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>{statistics.total_students}</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Преподавателей</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e67e22' }}>{statistics.total_teachers}</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Тестов</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9b59b6' }}>{statistics.total_tests}</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Попыток тестирования</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#34495e' }}>{statistics.total_test_attempts}</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>Процент успешных</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a085' }}>{statistics.pass_rate}%</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Управление пользователями</h2>
              <button
                onClick={() => setShowUserForm(!showUserForm)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {showUserForm ? 'Отмена' : 'Добавить пользователя'}
              </button>
            </div>

            {showUserForm && (
              <form onSubmit={handleCreateUser} style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Фамилия"
                    value={userFormData.last_name}
                    onChange={(e) => setUserFormData({ ...userFormData, last_name: e.target.value })}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="text"
                    placeholder="Имя"
                    value={userFormData.first_name}
                    onChange={(e) => setUserFormData({ ...userFormData, first_name: e.target.value })}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="text"
                    placeholder="Отчество (необязательно)"
                    value={userFormData.middle_name}
                    onChange={(e) => setUserFormData({ ...userFormData, middle_name: e.target.value })}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="password"
                    placeholder="Пароль"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="student">Студент</option>
                    <option value="teacher">Преподаватель</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
                <button type="submit" style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Создать
                </button>
              </form>
            )}

            {loading ? (
              <p>Загрузка...</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>ФИО</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Роль</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                        {user.last_name} {user.first_name} {user.middle_name || ''}
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>{user.email}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>{user.role}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Управление курсами</h2>
              <button
                onClick={() => setShowCourseForm(!showCourseForm)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {showCourseForm ? 'Отмена' : 'Добавить курс'}
              </button>
            </div>

            {showCourseForm && (
              <form onSubmit={handleCreateCourse} style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <input
                  type="text"
                  placeholder="Название курса"
                  value={courseFormData.name}
                  onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem' }}
                />
                <textarea
                  placeholder="Описание курса"
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem', minHeight: '100px' }}
                />
                <button type="submit" style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Создать
                </button>
              </form>
            )}

            {loading ? (
              <p>Загрузка...</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {courses.map((course) => (
                  <div key={course.id} style={{ padding: '1rem', border: '1px solid #dee2e6', borderRadius: '4px' }}>
                    <h3 style={{ marginTop: 0 }}>{course.name}</h3>
                    <p>{course.description}</p>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Удалить
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
