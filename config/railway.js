// Railway deployment configuration with embedded environment variables
export const railwayConfig = {
  // Database configuration - используем Railway DATABASE_URL
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/railway",
  
  // Session configuration
  SESSION_SECRET: process.env.SESSION_SECRET || "RailwayRealEstateCRM2024-SuperSecretKey-ChangeThisInProduction-12345",
  
  // Replit Auth configuration - используем Railway домен
  REPLIT_DOMAINS: process.env.REPLIT_DOMAINS || "realestatemanagerreplit-production.up.railway.app",
  REPL_ID: process.env.REPL_ID || "railway-real-estate-crm",
  ISSUER_URL: process.env.ISSUER_URL || "https://replit.com/oidc",
  
  // Server configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "production",
  
  // CORS configuration - используем Railway домен
  CORS_ORIGIN: process.env.CORS_ORIGIN || "https://realestatemanagerreplit-production.up.railway.app"
};

// Set environment variables for Railway
Object.entries(railwayConfig).forEach(([key, value]) => {
  if (!process.env[key]) {
    process.env[key] = value;
  }
});