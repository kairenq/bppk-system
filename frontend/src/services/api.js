import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getCurrentUser: () => api.get('/users/me'),
};

export const adminAPI = {
  getUsers: (role = null) => api.get('/admin/users', { params: { role } }),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getStatistics: () => api.get('/admin/statistics'),
  getCourses: () => api.get('/admin/courses'),
  createCourse: (data) => api.post('/admin/courses', data),
  updateCourse: (id, data) => api.put(`/admin/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),
};

export const teacherAPI = {
  getTests: () => api.get('/teacher/tests'),
  getTest: (id) => api.get(`/teacher/tests/${id}`),
  createTest: (data) => api.post('/teacher/tests', data),
  updateTest: (id, data) => api.put(`/teacher/tests/${id}`, data),
  deleteTest: (id) => api.delete(`/teacher/tests/${id}`),
  getTestResults: (testId) => api.get(`/teacher/tests/${testId}/results`),
  getStatistics: () => api.get('/teacher/statistics'),
  getStudentsPerformance: () => api.get('/teacher/students-performance'),
};

export const studentAPI = {
  getTests: () => api.get('/student/tests'),
  getTest: (id) => api.get(`/student/tests/${id}`),
  submitTest: (testId, data) => api.post(`/student/tests/${testId}/submit`, data),
  getMyResults: () => api.get('/student/my-results'),
  getMyStatistics: () => api.get('/student/my-statistics'),
  getMyTestAttempts: (testId) => api.get(`/student/test/${testId}/my-attempts`),
};

export default api;
