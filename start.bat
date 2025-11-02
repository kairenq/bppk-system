@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo    Система тестирования БППК
echo    Автоматический запуск
echo ========================================
echo.

REM Проверка наличия Python
echo [1/6] Проверка Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python не найден! Установите Python 3.8 или выше.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✓ Python найден: %PYTHON_VERSION%
echo.

REM Проверка наличия Node.js
echo [2/6] Проверка Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не найден! Установите Node.js 16 или выше.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js найден: %NODE_VERSION%
echo.

REM Проверка наличия npm
echo [3/6] Проверка npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm не найден! Установите npm.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✓ npm найден: %NPM_VERSION%
echo.

REM Установка зависимостей Backend
echo [4/6] Установка зависимостей Backend...
cd backend
if not exist "venv" (
    echo Создание виртуального окружения...
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo ❌ Ошибка установки зависимостей Backend
    pause
    exit /b 1
)
echo ✓ Зависимости Backend установлены
echo.

REM Инициализация базы данных
echo Инициализация базы данных...
if not exist "exam_system.db" (
    python -c "from app.db.base import Base, engine; from app.models import user, course, test, result; from app.core.security import get_password_hash; from sqlalchemy.orm import sessionmaker; from app.models.user import User, UserRole; Base.metadata.create_all(bind=engine); SessionLocal = sessionmaker(bind=engine); db = SessionLocal(); admin = User(email='admin@bppk.ru', hashed_password=get_password_hash('admin123'), first_name='Админ', last_name='Администратор', middle_name='Иванович', role=UserRole.ADMIN); teacher = User(email='teacher@bppk.ru', hashed_password=get_password_hash('teacher123'), first_name='Преподаватель', last_name='Петров', middle_name='Сергеевич', role=UserRole.TEACHER); student = User(email='student@bppk.ru', hashed_password=get_password_hash('student123'), first_name='Студент', last_name='Сидоров', middle_name='Александрович', role=UserRole.STUDENT); db.add_all([admin, teacher, student]); db.commit(); db.close(); print('База данных инициализирована')"
    echo ✓ База данных создана
) else (
    echo ✓ База данных уже существует
)
echo.

REM Установка зависимостей Frontend
echo [5/6] Установка зависимостей Frontend...
cd ..\frontend
if not exist "node_modules" (
    call npm install --silent
    if errorlevel 1 (
        echo ❌ Ошибка установки зависимостей Frontend
        pause
        exit /b 1
    )
)
echo ✓ Зависимости Frontend установлены
echo.

REM Запуск приложения
echo [6/6] Запуск приложения...
echo ========================================
echo 🚀 Запуск Backend на http://localhost:8000
echo 🌐 Запуск Frontend на http://localhost:5173
echo ========================================
echo.
echo 📝 Тестовые аккаунты:
echo    Admin: admin@bppk.ru / admin123
echo    Teacher: teacher@bppk.ru / teacher123
echo    Student: student@bppk.ru / student123
echo.
echo 💡 Для остановки закройте это окно или нажмите Ctrl+C
echo.

REM Запуск Backend в новом окне
cd ..\backend
start "BPPK Backend" cmd /k "call venv\Scripts\activate.bat && uvicorn app.main:app --host 0.0.0.0 --port 8000"

REM Небольшая задержка для запуска backend
timeout /t 3 /nobreak >nul

REM Запуск Frontend в новом окне
cd ..\frontend
start "BPPK Frontend" cmd /k "npm run dev"

echo.
echo ✓ Приложение запущено!
echo ✓ Backend работает в отдельном окне
echo ✓ Frontend работает в отдельном окне
echo.
echo Откройте браузер и перейдите на http://localhost:5173
echo.
pause
