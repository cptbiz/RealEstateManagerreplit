# 🚨 Railway Immediate Fix

## Проблема: ./build-production.sh: not found

### Причина
Docker контейнер не может найти скрипт build-production.sh потому что он не копируется в контейнер.

### ✅ Решение
Заменил скрипт на прямую команду esbuild в конфигурационных файлах.

## Исправленные файлы:

### 1. Dockerfile
```dockerfile
# Вместо скрипта используем прямую команду
RUN npx esbuild server/index.production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.production.js
```

### 2. railway.json
```json
{
  "buildCommand": "npm ci && npm run build && npx esbuild server/index.production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.production.js"
}
```

### 3. nixpacks.toml
```toml
[phases.build]
cmds = ["npm run build", "npx esbuild server/index.production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.production.js"]
```

## 🔄 Теперь Railway deployment должен пройти:

1. ✅ Build frontend: `npm run build`
2. ✅ Build production server: `npx esbuild server/index.production.ts`
3. ✅ Start: `node dist/index.production.js`

## Готово к deployment!

Теперь все команды встроены в конфигурацию и не требуют внешних скриптов.