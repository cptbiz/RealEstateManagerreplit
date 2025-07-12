#!/bin/bash

# Railway deployment script
echo "Starting Railway deployment..."

# Set production environment
export NODE_ENV=production

# Check if database is ready
echo "Checking database connection..."
until nc -z $PGHOST $PGPORT; do
  echo "Waiting for database..."
  sleep 1
done

# Run database migrations
echo "Running database migrations..."
npm run db:push

# Start the application
echo "Starting application..."
node dist/index.production.js