#!/bin/bash

# Railway deployment script
echo "Starting Railway deployment..."

# Set production environment
export NODE_ENV=production

# Run database migrations
echo "Running database migrations..."
npm run db:push

# Start the application
echo "Starting application..."
npm start