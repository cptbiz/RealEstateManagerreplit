// Railway deployment configuration with embedded environment variables
export const railwayConfig = {
  // Database configuration - ЗАМЕНИТЕ НА ВАШУ БАЗУ ДАННЫХ
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:YOUR_PASSWORD@containers-us-west-XXX.railway.app:XXXX/railway",
  
  // Session configuration - ЗАМЕНИТЕ НА СЛУЧАЙНЫЙ СЕКРЕТ
  SESSION_SECRET: process.env.SESSION_SECRET || "RailwayRealEstateCRM2024-SuperSecretKey-ChangeThisInProduction-12345",
  
  // Replit Auth configuration - ЗАМЕНИТЕ НА ВАШ ДОМЕН
  REPLIT_DOMAINS: process.env.REPLIT_DOMAINS || "your-app-name.railway.app",
  REPL_ID: process.env.REPL_ID || "railway-real-estate-crm",
  ISSUER_URL: process.env.ISSUER_URL || "https://replit.com/oidc",
  
  // Server configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "production",
  
  // CORS configuration - ЗАМЕНИТЕ НА ВАШ ДОМЕН
  CORS_ORIGIN: process.env.CORS_ORIGIN || "https://your-app-name.railway.app"
};

// Set environment variables for Railway
Object.entries(railwayConfig).forEach(([key, value]) => {
  if (!process.env[key]) {
    process.env[key] = value;
  }
});