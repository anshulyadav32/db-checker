#!/bin/bash

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Create application directory
sudo mkdir -p /var/www/db-connect-checker
sudo chown -R $USER:$USER /var/www/db-connect-checker

# Install dependencies
cd /var/www/db-connect-checker
npm install

# Setup PM2 to start on boot
sudo pm2 startup
pm2 start ecosystem.config.js
pm2 save

# Install and configure Nginx
sudo apt-get install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/db-connect-checker << EOF
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        root /var/www/db-connect-checker/client/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site and restart Nginx
sudo ln -s /etc/nginx/sites-available/db-connect-checker /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl restart nginx

# Setup environment variables
tee .env << EOF
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost
EOF

# Set proper permissions
sudo chown -R $USER:$USER /var/www/db-connect-checker
sudo chmod -R 755 /var/www/db-connect-checker
