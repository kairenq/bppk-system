#!/bin/bash

# Backend запуск для RED OS / Linux

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   БППК Backend Server${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Проверка Python3
echo -e "${YELLOW}[1/4] Проверка Python3...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 не найден!${NC}"
    echo -e "${YELLOW}Установите Python3:${NC}"
    echo -e "  sudo dnf install python3 python3-pip"
    exit 1
fi
echo -e "${GREEN}✓ Python3: $(python3 --version)${NC}"
echo ""

# Переход в директорию backend
cd "$(dirname "$0")/backend" || exit 1

# Создание виртуального окружения
echo -e "${YELLOW}[2/4] Настройка виртуального окружения...${NC}"
if [ ! -d "venv" ]; then
    echo -e "${BLUE}Создание venv...${NC}"
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Ошибка создания venv${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ Виртуальное окружение готово${NC}"
echo ""

# Активация виртуального окружения
source venv/bin/activate

# Установка зависимостей
echo -e "${YELLOW}[3/4] Установка зависимостей...${NC}"
pip install -r requirements.txt --quiet
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка установки зависимостей${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Зависимости установлены${NC}"
echo ""

# Инициализация базы данных
echo -e "${YELLOW}Проверка базы данных...${NC}"
if [ ! -f "exam_system.db" ]; then
    echo -e "${BLUE}Создание базы данных...${NC}"
    python3 -c "
from app.db.base import Base, engine
from app.models import user, course, test, result
from app.core.security import get_password_hash
from sqlalchemy.orm import sessionmaker
from app.models.user import User, UserRole

print('Создание таблиц...')
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

print('Создание тестовых пользователей...')
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
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Ошибка создания базы данных${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ База данных создана${NC}"
else
    echo -e "${GREEN}✓ База данных уже существует${NC}"
fi
echo ""

# Запуск сервера
echo -e "${YELLOW}[4/4] Запуск Backend сервера...${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}🚀 Backend запущен на:${NC}"
echo -e "${GREEN}   http://localhost:8000${NC}"
echo -e "${GREEN}   http://127.0.0.1:8000${NC}"
echo ""
echo -e "${GREEN}📚 Swagger документация:${NC}"
echo -e "${GREEN}   http://localhost:8000/docs${NC}"
echo ""
echo -e "${YELLOW}📝 Тестовые аккаунты:${NC}"
echo -e "   Admin: admin@bppk.ru / admin123"
echo -e "   Teacher: teacher@bppk.ru / teacher123"
echo -e "   Student: student@bppk.ru / student123"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}💡 Для остановки нажмите Ctrl+C${NC}"
echo ""

# Запуск uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
