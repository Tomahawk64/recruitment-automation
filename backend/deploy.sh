#!/bin/bash

# Backend Deployment Script for AWS EC2
# This script should be run on your Ubuntu server

set -e  # Exit on error

echo "=================================="
echo "Backend Deployment Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="recruitment-automation-backend"
APP_DIR="/var/www/${APP_NAME}/backend"
REPO_URL="https://github.com/YOUR_USERNAME/recruitment-automation.git"  # Update this!

echo -e "${YELLOW}Step 1: Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${YELLOW}Step 2: Installing Node.js 18...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}Node.js installed: $(node --version)${NC}"
else
    echo -e "${GREEN}Node.js already installed: $(node --version)${NC}"
fi

echo -e "${YELLOW}Step 3: Installing PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    echo -e "${GREEN}PM2 installed: $(pm2 --version)${NC}"
else
    echo -e "${GREEN}PM2 already installed: $(pm2 --version)${NC}"
fi

echo -e "${YELLOW}Step 4: Creating application directory...${NC}"
sudo mkdir -p /var/www/${APP_NAME}
sudo chown -R $USER:$USER /var/www/${APP_NAME}

echo -e "${YELLOW}Step 5: Cloning repository...${NC}"
if [ -d "/var/www/${APP_NAME}/.git" ]; then
    echo -e "${YELLOW}Repository already exists, pulling latest changes...${NC}"
    cd /var/www/${APP_NAME}
    git pull
else
    cd /var/www/${APP_NAME}
    git clone ${REPO_URL} .
fi

cd ${APP_DIR}

echo -e "${YELLOW}Step 6: Installing dependencies...${NC}"
npm install --production

echo -e "${YELLOW}Step 7: Checking .env file...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}ERROR: .env file not found!${NC}"
    echo -e "${YELLOW}Please create .env file with required variables:${NC}"
    echo "  - MONGO_URI"
    echo "  - PORT"
    echo "  - NODE_ENV"
    echo "  - JWT_SECRET"
    echo "  - FRONTEND_URL"
    echo ""
    echo "Copy from .env.example and edit:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
else
    echo -e "${GREEN}.env file found${NC}"
fi

echo -e "${YELLOW}Step 8: Starting application with PM2...${NC}"
if pm2 list | grep -q ${APP_NAME}; then
    echo -e "${YELLOW}Restarting existing PM2 process...${NC}"
    pm2 restart ${APP_NAME}
else
    echo -e "${YELLOW}Starting new PM2 process...${NC}"
    pm2 start ecosystem.config.js
fi

echo -e "${YELLOW}Step 9: Configuring PM2 startup...${NC}"
pm2 startup systemd -u $USER --hp $HOME
pm2 save

echo -e "${YELLOW}Step 10: Configuring firewall...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 4000/tcp
sudo ufw --force enable

echo ""
echo -e "${GREEN}=================================="
echo "Deployment Complete!"
echo "==================================${NC}"
echo ""
echo "Backend is running at: http://$(curl -s ifconfig.me):4000"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check app status"
echo "  pm2 logs ${APP_NAME}    - View logs"
echo "  pm2 restart ${APP_NAME} - Restart app"
echo "  pm2 monit               - Monitor resources"
echo ""
echo "Next steps:"
echo "1. Test backend: curl http://localhost:4000/health"
echo "2. Deploy frontend on Render"
echo "3. Update backend FRONTEND_URL in .env"
echo ""
