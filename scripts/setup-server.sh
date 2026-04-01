#!/bin/bash
# Server setup script for Salus Medical on Ubuntu 22.04 Lightsail
set -e

echo "=== Updating system ==="
sudo apt-get update && sudo apt-get upgrade -y

echo "=== Installing Node.js 18 ==="
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "=== Installing Nginx ==="
sudo apt-get install -y nginx

echo "=== Installing PM2 ==="
sudo npm install -g pm2

echo "=== Installing Certbot for SSL ==="
sudo apt-get install -y certbot python3-certbot-nginx

echo "=== Creating app directory ==="
sudo mkdir -p /var/www/salusmedical
sudo chown ubuntu:ubuntu /var/www/salusmedical

echo "=== Configuring Nginx ==="
sudo tee /etc/nginx/sites-available/salusmedical > /dev/null <<'NGINX'
server {
    listen 80;
    server_name salusmedical.co www.salusmedical.co _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/salusmedical /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

echo "=== Setting up PM2 startup ==="
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "=== Setup complete ==="
echo "Node: $(node -v)"
echo "NPM: $(npm -v)"
echo "Nginx: $(nginx -v 2>&1)"
echo ""
echo "Next steps:"
echo "1. Clone repo to /var/www/salusmedical"
echo "2. npm install && npm run build"
echo "3. pm2 start npm --name salusmedical -- start"
echo "4. pm2 save"
