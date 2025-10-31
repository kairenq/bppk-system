# API Документация

## Базовый URL
```
http://localhost:8000/api/v1
```

## Аутентификация

### Регистрация
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "last_name": "Иванов",
  "first_name": "Иван",
  "middle_name": "Иванович",  // опционально
  "role": "student"  // student, teacher, admin
}
```

### Вход
```http
POST /auth/login
Content-Type: multipart/form-data

username: user@example.com
password: password123
```

Ответ:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Получение текущего пользователя
```http
GET /users/me
Authorization: Bearer <token>
```

## Эндпоинты администратора

### Получить список пользователей
```http
GET /admin/users?role=student&skip=0&limit=100
Authorization: Bearer <token>
```

### Создать пользователя
```http
POST /admin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "last_name": "Петров",
  "first_name": "Петр",
  "middle_name": "Петрович",
  "role": "teacher"
}
```

### Обновить пользователя
```http
PUT /admin/users/{user_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "teacher",
  "is_active": true
}
```

### Удалить пользователя
```http
DELETE /admin/users/{user_id}
Authorization: Bearer <token>
```

### Получить статистику системы
```http
GET /admin/statistics
Authorization: Bearer <token>
```

### Управление курсами
```http
GET /admin/courses
POST /admin/courses
PUT /admin/courses/{course_id}
DELETE /admin/courses/{course_id}
Authorization: Bearer <token>
```

## Эндпоинты преподавателя

### Получить список своих тестов
```http
GET /teacher/tests
Authorization: Bearer <token>
```

### Получить тест по ID
```http
GET /teacher/tests/{test_id}
Authorization: Bearer <token>
```

### Создать тест
```http
POST /teacher/tests
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Тест по математике",
  "description": "Тест на знание алгебры",
  "time_limit": 60,
  "passing_score": 70,
  "questions": [
    {
      "question_text": "Сколько будет 2+2?",
      "question_type": "single_choice",
      "points": 1,
      "order": 0,
      "answers": [
        {
          "answer_text": "3",
          "is_correct": false,
          "order": 0
        },
        {
          "answer_text": "4",
          "is_correct": true,
          "order": 1
        },
        {
          "answer_text": "5",
          "is_correct": false,
          "order": 2
        }
      ]
    }
  ]
}
```

### Обновить тест
```http
PUT /teacher/tests/{test_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Новое название теста",
  "is_active": true
}
```

### Удалить тест
```http
DELETE /teacher/tests/{test_id}
Authorization: Bearer <token>
```

### Получить результаты теста
```http
GET /teacher/tests/{test_id}/results
Authorization: Bearer <token>
```

### Получить статистику преподавателя
```http
GET /teacher/statistics
Authorization: Bearer <token>
```

### Получить успеваемость студентов
```http
GET /teacher/students-performance
Authorization: Bearer <token>
```

## Эндпоинты студента

### Получить список доступных тестов
```http
GET /student/tests
Authorization: Bearer <token>
```

### Получить тест для прохождения
```http
GET /student/tests/{test_id}
Authorization: Bearer <token>
```

### Отправить результаты теста
```http
POST /student/tests/{test_id}/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "test_id": 1,
  "started_at": "2024-01-01T12:00:00",
  "answers": {
    "1": 5,        // question_id: answer_id (для single_choice)
    "2": [6, 7]    // question_id: [answer_ids] (для multiple_choice)
  }
}
```

### Получить свои результаты
```http
GET /student/my-results
Authorization: Bearer <token>
```

### Получить свою статистику
```http
GET /student/my-statistics
Authorization: Bearer <token>
```

### Получить историю попыток по тесту
```http
GET /student/test/{test_id}/my-attempts
Authorization: Bearer <token>
```

## Коды ответов

- `200` - Успешный запрос
- `201` - Ресурс создан
- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Нет доступа
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера

## Примеры использования с curl

### Регистрация
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "last_name": "Тестов",
    "first_name": "Тест",
    "role": "student"
  }'
```

### Вход
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test123"
```

### Получение тестов (с токеном)
```bash
curl -X GET http://localhost:8000/api/v1/student/tests \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
