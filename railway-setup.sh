#!/bin/bash

# Railway Setup Script for Real Estate CRM
echo "🚀 Setting up Real Estate CRM for Railway deployment..."

# Install Railway CLI if not installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "Please login to Railway..."
railway login

# Initialize Railway project
echo "Initializing Railway project..."
railway init

# Add PostgreSQL service
echo "Adding PostgreSQL service..."
railway add --service postgresql

# Get database URL
echo "Getting database URL..."
railway variables

echo "✅ Railway setup complete!"
echo ""
echo "Next steps:"
echo "1. Update config/railway.js with your database URL"
echo "2. Update domain settings in config/railway.js"
echo "3. Run: railway up"
echo ""
echo "📖 For detailed instructions, see railway-deploy.md"