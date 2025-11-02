#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Система тестирования БППК${NC}"
echo -e "${BLUE}   Автоматический запуск${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Проверка наличия Python3
echo -e "${YELLOW}[1/6] Проверка Python3...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 не найден! Установите Python 3.8 или выше.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python3 найден: $(python3 --version)${NC}"
echo ""

# Проверка наличия Node.js
echo -e "${YELLOW}[2/6] Проверка Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js не найден! Установите Node.js 16 или выше.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js найден: $(node --version)${NC}"
echo ""

# Проверка наличия npm
echo -e "${YELLOW}[3/6] Проверка npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm не найден! Установите npm.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm найден: $(npm --version)${NC}"
echo ""

# Установка зависимостей Backend
echo -e "${YELLOW}[4/6] Установка зависимостей Backend...${NC}"
cd backend
if [ ! -d "venv" ]; then
    echo -e "${BLUE}Создание виртуального окружения...${NC}"
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt --quiet
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка установки зависимостей Backend${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Зависимости Backend установлены${NC}"
echo ""

# Инициализация базы данных
echo -e "${YELLOW}Инициализация базы данных...${NC}"
if [ ! -f "exam_system.db" ]; then
    python3 -c "
from app.db.base import Base, engine
from app.models import user, course, test, result
from app.core.security import get_password_hash
from sqlalchemy.orm import sessionmaker
from app.models.user import User, UserRole

Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

# Создаем тестовых пользователей
admin = User(
    email='admin@bppk.ru',
    hashed_password=get_password_hash('admin123'),
    first_name='Админ',
    last_name='Администратор',
    middle_name='Иванович',
    role=UserRole.ADMIN
)

teacher = User(
    email='teacher@bppk.ru',
    hashed_password=get_password_hash('teacher123'),
    first_name='Преподаватель',
    last_name='Петров',
    middle_name='Сергеевич',
    role=UserRole.TEACHER
)

student = User(
    email='student@bppk.ru',
    hashed_password=get_password_hash('student123'),
    first_name='Студент',
    last_name='Сидоров',
    middle_name='Александрович',
    role=UserRole.STUDENT
)

db.add_all([admin, teacher, student])
db.commit()
db.close()
print('✓ База данных инициализирована')
"
    echo -e "${GREEN}✓ База данных создана${NC}"
else
    echo -e "${GREEN}✓ База данных уже существует${NC}"
fi
echo ""

# Установка зависимостей Frontend
echo -e "${YELLOW}[5/6] Установка зависимостей Frontend...${NC}"
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install --silent
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Ошибка установки зависимостей Frontend${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ Зависимости Frontend установлены${NC}"
echo ""

# Запуск приложения
echo -e "${YELLOW}[6/6] Запуск приложения...${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}🚀 Запуск Backend на http://localhost:8000${NC}"
echo -e "${GREEN}🌐 Запуск Frontend на http://localhost:5173${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}📝 Тестовые аккаунты:${NC}"
echo -e "   Admin: admin@bppk.ru / admin123"
echo -e "   Teacher: teacher@bppk.ru / teacher123"
echo -e "   Student: student@bppk.ru / student123"
echo ""
echo -e "${YELLOW}💡 Для остановки нажмите Ctrl+C${NC}"
echo ""

# Запуск Backend в фоне
cd ../backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Небольшая задержка для запуска backend
sleep 3

# Запуск Frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Функция для корректного завершения
cleanup() {
    echo ""
    echo -e "${YELLOW}Остановка приложения...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✓ Приложение остановлено${NC}"
    exit 0
}

# Обработка сигналов завершения
trap cleanup SIGINT SIGTERM

# Ожидание завершения
wait
