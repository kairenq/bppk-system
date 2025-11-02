# 🚀 Запуск на RED OS / Linux

Инструкции для запуска приложения на RED OS и других дистрибутивах Linux.

## 📋 Требования

Убедитесь, что установлены:

- **Python 3.8+**
- **Node.js 16+**
- **npm**

### Установка на RED OS

RED OS основана на RHEL/CentOS, используйте `dnf`:

```bash
# Python 3
sudo dnf install python3 python3-pip

# Node.js и npm
sudo dnf install nodejs npm

# Или через NodeSource (рекомендуется для последней версии):
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install nodejs
```

## 🎯 Варианты запуска

### Вариант 1: Запуск Backend и Frontend вместе

```bash
chmod +x start.sh
./start.sh
```

Этот скрипт запустит оба сервиса одновременно.

### Вариант 2: Раздельный запуск (рекомендуется)

Откройте **два терминала**:

**Терминал 1 - Backend:**
```bash
chmod +x start-backend.sh
./start-backend.sh
```

**Терминал 2 - Frontend:**
```bash
chmod +x start-frontend.sh
./start-frontend.sh
```

## 📂 Что делают скрипты?

### start-backend.sh

1. ✅ Проверяет наличие Python3
2. 📦 Создает виртуальное окружение venv
3. 📦 Устанавливает Python зависимости
4. 🗄️ Создает базу данных SQLite (при первом запуске)
5. 👥 Создает тестовых пользователей
6. 🚀 Запускает Backend API на `http://localhost:8000`

### start-frontend.sh

1. ✅ Проверяет наличие Node.js и npm
2. 📦 Устанавливает npm зависимости
3. 🌐 Запускает Frontend на `http://localhost:5173`

## 🌐 Доступ к приложению

После запуска:

- **Frontend (пользовательский интерфейс):** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API документация (Swagger):** http://localhost:8000/docs

## 🔐 Тестовые аккаунты

| Роль          | Email               | Пароль      |
|---------------|---------------------|-------------|
| Администратор | admin@bppk.ru      | admin123    |
| Преподаватель | teacher@bppk.ru    | teacher123  |
| Студент       | student@bppk.ru    | student123  |

## 🛑 Остановка сервисов

В каждом терминале нажмите **Ctrl+C**

## ❓ Решение проблем

### Порт уже занят

Если порт 8000 или 5173 уже используется:

```bash
# Найти процесс на порту 8000
sudo lsof -ti:8000 | xargs kill -9

# Найти процесс на порту 5173
sudo lsof -ti:5173 | xargs kill -9
```

### Python не найден

```bash
# RED OS / RHEL / CentOS
sudo dnf install python3 python3-pip

# Ubuntu / Debian
sudo apt install python3 python3-pip python3-venv

# Fedora
sudo dnf install python3 python3-pip
```

### Node.js не найден

```bash
# RED OS / RHEL / CentOS / Fedora
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install nodejs

# Ubuntu / Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs
```

### Ошибка "venv не найден"

```bash
sudo dnf install python3-venv
# или
sudo apt install python3-venv
```

### Ошибка прав доступа

```bash
# Дать права на выполнение всем скриптам
chmod +x start.sh start-backend.sh start-frontend.sh
```

## 🔧 Ручной запуск (без скриптов)

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📝 Разработка

При разработке рекомендуется запускать Backend и Frontend в отдельных терминалах с флагом `--reload` для автоматической перезагрузки при изменениях.

Backend уже запускается с `--reload` флагом в `start-backend.sh`.

## 🗄️ База данных

База данных SQLite создается автоматически в файле:
```
backend/exam_system.db
```

Для сброса базы данных просто удалите этот файл:
```bash
rm backend/exam_system.db
```

При следующем запуске `start-backend.sh` база будет создана заново.

## 💡 Советы

- Backend должен быть запущен **ДО** запуска Frontend
- При первом запуске установка зависимостей может занять 2-5 минут
- Логи Backend и Frontend будут видны в терминалах
- Для продакшн развертывания смотрите документацию по Docker

## 🆘 Поддержка

Если возникли проблемы:

1. Проверьте, что Python 3.8+ и Node.js 16+ установлены
2. Убедитесь, что порты 8000 и 5173 свободны
3. Проверьте логи в терминале на наличие ошибок
4. Посмотрите другие README файлы в проекте

---

**Успешной работы! 🎓**
