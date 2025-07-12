# 🚀 Railway Deployment - Quick Start

## Быстрое развертывание Real Estate CRM на Railway

### 1. Подготовка (5 минут)
```bash
# Клонируйте репозиторий
git clone your-repo-url
cd real-estate-crm

# Обновите конфигурацию
# Отредактируйте файл config/railway.js
```

### 2. Настройка базы данных
В файле `config/railway.js` замените:
```javascript
DATABASE_URL: "postgresql://postgres:YOUR_PASSWORD@containers-us-west-XXX.railway.app:XXXX/railway"
```

### 3. Настройка домена
В файле `config/railway.js` замените:
```javascript
REPLIT_DOMAINS: "your-app-name.railway.app",
CORS_ORIGIN: "https://your-app-name.railway.app"
```

### 4. Развертывание
```bash
# Установите Railway CLI
npm install -g @railway/cli

# Войдите в аккаунт
railway login

# Создайте проект
railway init

# Разверните
railway up
```

### 5. Готово! 🎉
Ваша CRM система будет доступна по адресу:
`https://your-app-name.railway.app`

## Что уже настроено:
- ✅ Все переменные окружения встроены в код
- ✅ Автоматическая миграция базы данных
- ✅ Настройка CORS для production
- ✅ Оптимизация для Railway
- ✅ Docker контейнеризация
- ✅ Обработка ошибок в production

## Функции CRM:
- 🏠 Управление недвижимостью с изображениями
- 📊 Аналитика и отчеты
- 👥 Управление клиентами и контактами
- 📅 Календарь встреч
- 📋 Система задач
- 📁 Документооборот
- 🔐 Аутентификация через Replit Auth
- 👤 Три типа пользователей (застройщики, агентства, физлица)

Готово к использованию в production!