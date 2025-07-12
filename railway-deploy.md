# Railway Deployment Guide - Real Estate CRM

## Подготовка к развертыванию

### 1. Создание аккаунта на Railway
1. Перейдите на [railway.app](https://railway.app)
2. Зарегистрируйтесь через GitHub
3. Создайте новый проект

### 2. Настройка базы данных
1. В Railway добавьте PostgreSQL сервис
2. Скопируйте DATABASE_URL из настроек PostgreSQL
3. Замените в файле `config/railway.js` строку:
   ```javascript
   DATABASE_URL: process.env.DATABASE_URL || "postgresql://neondb_owner:YOUR_PASSWORD@ep-YOUR_ENDPOINT.us-east-1.aws.neon.tech/neondb?sslmode=require",
   ```
   На вашу DATABASE_URL

### 3. Настройка переменных окружения
В файле `config/railway.js` обновите следующие переменные:

```javascript
// Database configuration - ЗАМЕНИТЕ НА ВАШУ БАЗУ ДАННЫХ
DATABASE_URL: "postgresql://postgres:YOUR_PASSWORD@containers-us-west-XXX.railway.app:XXXX/railway",

// Session configuration - ЗАМЕНИТЕ НА СЛУЧАЙНЫЙ СЕКРЕТ
SESSION_SECRET: "your-super-secret-session-key-change-this-in-production-12345",

// Replit Auth configuration - ЗАМЕНИТЕ НА ВАШ ДОМЕН
REPLIT_DOMAINS: "your-app-name.railway.app",
REPL_ID: "railway-real-estate-crm",

// CORS configuration - ЗАМЕНИТЕ НА ВАШ ДОМЕН
CORS_ORIGIN: "https://your-app-name.railway.app"
```

### 4. Развертывание на Railway

#### Способ 1: Через GitHub
1. Загрузите код на GitHub
2. В Railway выберите "Deploy from GitHub repo"
3. Выберите ваш репозиторий
4. Railway автоматически определит настройки сборки

#### Способ 2: Через Railway CLI
```bash
# Установите Railway CLI
npm install -g @railway/cli

# Войдите в аккаунт
railway login

# Инициализируйте проект
railway init

# Разверните приложение
railway up
```

### 5. Настройка домена
1. В Railway перейдите в Settings
2. В разделе Domains добавьте custom domain или используйте сгенерированный
3. Обновите REPLIT_DOMAINS и CORS_ORIGIN в config/railway.js

### 6. Настройка Replit Auth
1. Перейдите в настройки Replit
2. Добавьте ваш Railway домен в разрешенные домены
3. Обновите redirect URLs для OAuth

## Структура файлов для развертывания

```
├── config/
│   └── railway.js          # Конфигурация с переменными окружения
├── railway.json            # Конфигурация Railway
├── nixpacks.toml          # Настройки сборки
├── Dockerfile             # Docker конфигурация
├── .dockerignore          # Игнорируемые файлы для Docker
├── start.sh               # Скрипт запуска
└── ...остальные файлы
```

## Проверка развертывания

1. Откройте ваш Railway URL
2. Проверьте, что загружается страница входа
3. Войдите через Replit Auth
4. Проверьте функциональность CRM

## Возможные проблемы и решения

### Проблема с базой данных
- Убедитесь, что DATABASE_URL правильно настроена
- Проверьте соединение с базой данных в логах Railway

### Проблема с аутентификацией
- Проверьте настройки Replit Auth
- Убедитесь, что домены правильно настроены

### Проблема со сборкой
- Проверьте логи сборки в Railway
- Убедитесь, что все зависимости установлены

## Готово к производству

После успешного развертывания ваша Real Estate CRM будет доступна по адресу:
`https://your-app-name.railway.app`

Все переменные окружения встроены в код, поэтому дополнительная настройка не требуется.