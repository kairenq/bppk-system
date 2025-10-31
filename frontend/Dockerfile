FROM node:18-alpine

WORKDIR /app

# Копирование package.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование остальных файлов
COPY . .

# Открываем порт
EXPOSE 3000

# Запуск приложения
CMD ["npm", "run", "dev"]
