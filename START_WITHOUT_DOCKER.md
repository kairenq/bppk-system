# 🚀 Запуск БЕЗ Docker (для Windows/Linux/Mac)

## Если у вас проблемы с Docker - используйте этот способ!

Этот способ не требует Docker и виртуализации. Всё будет работать!

---

## ⚙️ Что нужно установить

### 1. Python 3.11 или новее

**Проверьте установку:**
```bash
python --version
```

**Если не установлен:**
- Windows: https://www.python.org/downloads/ (скачайте и установите)
- Linux: `sudo apt install python3.11 python3.11-venv`
- Mac: `brew install python@3.11`

⚠️ **При установке на Windows обязательно поставьте галочку "Add Python to PATH"!**

### 2. Node.js 18 или новее

**Проверьте установку:**
```bash
node --version
```

**Если не установлен:**
- Скачайте с https://nodejs.org/ (выберите LTS версию)
- Установите с настройками по умолчанию

### 3. PostgreSQL

**Вариант А - Простой (Рекомендуется):**
Мы можем использовать SQLite вместо PostgreSQL! Это проще.

**Вариант Б - Полный:**
- Windows: https://www.postgresql.org/download/windows/
- Linux: `sudo apt install postgresql postgresql-contrib`
- Mac: `brew install postgresql`

---

## 🎯 Способ 1: С SQLite (БЕЗ PostgreSQL) - САМЫЙ ПРОСТОЙ!

Этот способ не требует установки PostgreSQL!

### Шаг 1: Измените настройки базы данных

Откройте файл: `backend/app/core/config.py`

Найдите строку:
```python
@property
def DATABASE_URL(self) -> str:
    return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
```

Замените на:
```python
@property
def DATABASE_URL(self) -> str:
    return "sqlite:///./bppk_exam.db"
```

### Шаг 2: Установите SQLite поддержку

Откройте файл: `backend/requirements.txt`

Измените строку:
```
psycopg2-binary==2.9.9
```

На:
```
# psycopg2-binary==2.9.9  # Закомментировано для SQLite
```

### Шаг 3: Запустите Backend

Откройте терминал (командную строку) и выполните:

```bash
# Перейдите в папку проекта
cd /home/user/bppk-system

# Перейдите в backend
cd backend

# Создайте виртуальное окружение
python -m venv venv

# Активируйте его
# На Windows:
venv\Scripts\activate
# На Linux/Mac:
source venv/bin/activate

# Установите зависимости
pip install -r requirements.txt

# Инициализируйте базу данных
python init_db.py

# Запустите сервер
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Вы должны увидеть:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

✅ **Backend запущен!** Не закрывайте это окно терминала.

### Шаг 4: Запустите Frontend

Откройте **НОВОЕ окно** терминала (не закрывайте предыдущее!):

```bash
# Перейдите в папку проекта
cd /home/user/bppk-system

# Перейдите в frontend
cd frontend

# Установите зависимости (первый раз займет время)
npm install

# Запустите приложение
npm run dev
```

Вы увидите:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

✅ **Frontend запущен!**

### Шаг 5: Откройте в браузере

Откройте: **http://localhost:3000**

🎉 **Готово!** Используйте тестовые аккаунты:
- Администратор: `admin@bppk.ru` / `admin123`
- Преподаватель: `teacher@bppk.ru` / `teacher123`
- Студент: `student@bppk.ru` / `student123`

---

## 🎯 Способ 2: С PostgreSQL (Полная версия)

### Шаг 1: Настройте PostgreSQL

После установки PostgreSQL:

**Windows:**
1. Найдите и запустите "SQL Shell (psql)"
2. Нажмите Enter для всех вопросов (оставьте значения по умолчанию)
3. Введите пароль, который вы задали при установке

**Linux:**
```bash
sudo -u postgres psql
```

### Шаг 2: Создайте базу данных

В psql выполните:
```sql
CREATE DATABASE bppk_exam;
\q
```

### Шаг 3: Создайте файл .env

Создайте файл `backend/.env` со следующим содержимым:

**Windows (если пароль postgres - "postgres"):**
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=bppk_exam
```

**Измените `POSTGRES_PASSWORD` на ваш реальный пароль!**

### Шаг 4: Запустите Backend

```bash
cd /home/user/bppk-system/backend

# Создайте виртуальное окружение
python -m venv venv

# Активируйте
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Установите зависимости
pip install -r requirements.txt

# Инициализируйте БД
python init_db.py

# Запустите сервер
python -m uvicorn app.main:app --reload
```

### Шаг 5: Запустите Frontend

В новом терминале:
```bash
cd /home/user/bppk-system/frontend
npm install
npm run dev
```

### Шаг 6: Откройте браузер

http://localhost:3000

---

## 🔧 Решение проблем

### ❌ Ошибка: "python не является внутренней или внешней командой"

**Решение:**
1. Переустановите Python с галочкой "Add Python to PATH"
2. Или используйте `python3` вместо `python`:
   ```bash
   python3 -m venv venv
   ```

### ❌ Ошибка: "npm не является внутренней или внешней командой"

**Решение:**
1. Переустановите Node.js
2. Перезагрузите компьютер после установки

### ❌ Ошибка: "venv\Scripts\activate не работает" (Windows)

**Решение:**
Используйте:
```bash
venv\Scripts\activate.bat
```

Или в PowerShell:
```bash
venv\Scripts\Activate.ps1
```

Если PowerShell блокирует, выполните:
```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### ❌ Порт 8000 или 3000 уже занят

**Решение:**
Измените порт при запуске:

Backend:
```bash
python -m uvicorn app.main:app --reload --port 8001
```

Frontend (в `vite.config.js` измените порт на 3001):
```javascript
server: {
  port: 3001,
  ...
}
```

### ❌ Ошибка подключения к PostgreSQL

**Решение:**
1. Проверьте, что PostgreSQL запущен:
   - Windows: откройте "Службы" и найдите "postgresql-x64-15"
   - Linux: `sudo systemctl status postgresql`

2. Проверьте пароль в файле `.env`

3. Попробуйте подключиться вручную:
   ```bash
   psql -U postgres -d bppk_exam
   ```

### ❌ Frontend не видит Backend

**Решение:**
1. Убедитесь, что Backend работает: откройте http://localhost:8000/docs
2. Проверьте, что в `frontend/src/services/api.js` правильный URL:
   ```javascript
   const API_URL = 'http://localhost:8000/api/v1';
   ```

---

## 📌 Краткая шпаргалка

### Каждый раз для запуска приложения:

**Терминал 1 (Backend):**
```bash
cd /home/user/bppk-system/backend
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
python -m uvicorn app.main:app --reload
```

**Терминал 2 (Frontend):**
```bash
cd /home/user/bppk-system/frontend
npm run dev
```

**Браузер:**
```
http://localhost:3000
```

### Для остановки:
Нажмите `Ctrl+C` в обоих терминалах

---

## ✅ Проверка успешного запуска

- [ ] Backend запущен: http://localhost:8000/docs открывается
- [ ] Frontend запущен: http://localhost:3000 открывается
- [ ] Можно войти с тестовым аккаунтом
- [ ] Создаются тесты как преподаватель
- [ ] Проходятся тесты как студент

**Всё работает!** 🎉

---

## 💡 Совет

Создайте bat-файл (Windows) или sh-файл (Linux/Mac) для быстрого запуска:

**start_backend.bat (Windows):**
```batch
@echo off
cd C:\path\to\bppk-system\backend
call venv\Scripts\activate
python -m uvicorn app.main:app --reload
pause
```

**start_frontend.bat (Windows):**
```batch
@echo off
cd C:\path\to\bppk-system\frontend
npm run dev
pause
```

Просто кликайте по этим файлам для запуска!

---

Если что-то не работает - пишите, помогу разобраться! 😊
