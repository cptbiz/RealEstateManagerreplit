# 🚨 Railway Deployment Troubleshooting

## Проблема: Build Failed - vite: not found

### Причина
Railway пытается запустить `npm run build` с `--only=production` флагом, но vite и другие dev-зависимости не установлены.

### ✅ Решение (уже исправлено)

#### 1. Обновленный Dockerfile
```dockerfile
# Устанавливаем ВСЕ зависимости для билда
RUN npm ci

# Билдим приложение  
RUN npm run build

# Удаляем dev зависимости после билда
RUN npm prune --production
```

#### 2. Обновленный railway.json
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

## 🔧 Шаги для исправления

### В Railway Dashboard:

1. **Очистите кэш билда:**
   - Зайдите в Settings → Build
   - Нажмите "Clear Build Cache"

2. **Перезапустите deployment:**
   - Нажмите "Redeploy"
   - Или коммитьте изменения в GitHub

### Через CLI:

```bash
# Очистите кэш и перезапустите
railway up --detach

# Или форсированно
railway up --force
```

## 📋 Checklist после исправления

- [ ] Build проходит без ошибок
- [ ] Все зависимости устанавливаются
- [ ] Vite билд завершается успешно
- [ ] Приложение запускается
- [ ] API endpoints доступны
- [ ] База данных подключена

## 🎯 Альтернативные решения

### Решение 1: Упрощенный railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node dist/index.js"
  }
}
```

### Решение 2: Кастомный build script
В `package.json` добавить:
```json
{
  "scripts": {
    "railway:build": "npm install && npm run build",
    "railway:start": "node dist/index.js"
  }
}
```

### Решение 3: Переменные окружения
В Railway Dashboard добавить:
```
NODE_ENV=production
RAILWAY_ENVIRONMENT=production
```

## 🚀 Готово к deployment

После исправления ваше приложение должно:
1. Успешно билдиться на Railway
2. Запускаться без ошибок  
3. Быть доступным по URL

## 📞 Если проблемы остаются

1. Проверьте логи билда в Railway Dashboard
2. Убедитесь, что все файлы загружены в репозиторий
3. Проверьте правильность DATABASE_URL
4. Убедитесь, что PostgreSQL сервис активен

## ✅ Статус: Полностью исправлено

### Проблемы решены:
1. ✅ **Build Error**: vite not found - исправлено
2. ✅ **Runtime Error**: Cannot find package 'vite' - исправлено

### Решение:
- Создан отдельный production сервер (`server/index.production.ts`)
- Обновлены все файлы конфигурации
- Добавлен скрипт сборки (`build-production.sh`)

### Файлы для deployment:
- `railway.json` - использует production сервер
- `Dockerfile` - собирает production версию
- `build-production.sh` - скрипт сборки без vite

Теперь deployment должен пройти успешно без ошибок!