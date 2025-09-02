#!/bin/bash

# Build frontend
cd client
npm install
npm run build

# Prepare server
cd ../server
npm install --production

# Create production archive
cd ..
tar -czf db-connect-checker.tar.gz \
    client/dist \
    server \
    ecosystem.config.js \
    deploy.sh
