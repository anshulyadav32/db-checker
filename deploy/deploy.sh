#!/bin/bash
set -e

# Pull latest code
git pull origin main

# Build frontend
cd client
npm install
npm run build

# Install backend dependencies
cd ../server
npm install --production

# Start/restart backend with PM2
pm2 delete db-checker-api || true
pm2 start index.js --name db-checker-api
pm2 save

# Reload nginx
sudo systemctl reload nginx

echo "Deployment complete!"
