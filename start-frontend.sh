#!/bin/bash

# Frontend запуск для RED OS / Linux

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   БPPK Frontend Server${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Проверка Node.js
echo -e "${YELLOW}[1/3] Проверка Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js не найден!${NC}"
    echo -e "${YELLOW}Установите Node.js:${NC}"
    echo -e "  # Установка через dnf"
    echo -e "  sudo dnf install nodejs npm"
    echo ""
    echo -e "  # Или через NodeSource (рекомендуется):"
    echo -e "  curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -"
    echo -e "  sudo dnf install nodejs"
    exit 1
fi
echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"
echo ""

# Проверка npm
echo -e "${YELLOW}[2/3] Проверка npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm не найден!${NC}"
    echo -e "${YELLOW}Установите npm:${NC}"
    echo -e "  sudo dnf install npm"
    exit 1
fi
echo -e "${GREEN}✓ npm: $(npm --version)${NC}"
echo ""

# Переход в директорию frontend
cd "$(dirname "$0")/frontend" || exit 1

# Установка зависимостей
echo -e "${YELLOW}[3/3] Проверка зависимостей...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Установка npm пакетов...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Ошибка установки зависимостей${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Зависимости установлены${NC}"
else
    echo -e "${GREEN}✓ Зависимости уже установлены${NC}"
fi
echo ""

# Запуск сервера
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}🌐 Frontend запущен на:${NC}"
echo -e "${GREEN}   http://localhost:5173${NC}"
echo -e "${GREEN}   http://127.0.0.1:5173${NC}"
echo ""
echo -e "${YELLOW}⚠️  Убедитесь, что Backend запущен на:${NC}"
echo -e "${YELLOW}   http://localhost:8000${NC}"
echo ""
echo -e "${YELLOW}📝 Тестовые аккаунты:${NC}"
echo -e "   Admin: admin@bppk.ru / admin123"
echo -e "   Teacher: teacher@bppk.ru / teacher123"
echo -e "   Student: student@bppk.ru / student123"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}💡 Для остановки нажмите Ctrl+C${NC}"
echo ""

# Запуск dev сервера
npm run dev
