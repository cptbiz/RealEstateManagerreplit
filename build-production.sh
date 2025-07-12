#!/bin/bash

# Build production server without vite dependencies
echo "Building production server..."
esbuild server/index.production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.production.js

echo "Production server build complete!"
echo "Files created:"
ls -la dist/

echo "Ready for Railway deployment!"