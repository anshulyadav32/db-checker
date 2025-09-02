# Deployment Instructions

1. SSH into your server:
   ```sh
   ssh -i ~/.ssh/key.pem ubuntu@your-server-ip
   ```

2. Clone or pull the latest code:
   ```sh
   cd /var/www/db-checker
   git pull origin main
   ```

3. Copy the Nginx config:
   ```sh
   sudo cp deploy/nginx.conf /etc/nginx/sites-available/db-checker
   sudo ln -sf /etc/nginx/sites-available/db-checker /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. Run the deploy script:
   ```sh
   cd /var/www/db-checker
   bash deploy/deploy.sh
   ```

5. (First time only) Install PM2 if needed:
   ```sh
   sudo npm install -g pm2
   ```

6. (Optional) Set up PM2 to start on boot:
   ```sh
   pm2 startup
   pm2 save
   ```
