#!/bin/bash

# Quick Deploy Script for AWS EC2
# Upload this to your server and run it

echo "🚀 Quick Backend Deployment"
echo "=========================="
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo "❌ Please don't run as root"
   exit 1
fi

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Create app directory
echo "📁 Creating app directory..."
sudo mkdir -p /var/www/recruitment-automation-backend
sudo chown -R $USER:$USER /var/www/recruitment-automation-backend

# Navigate to directory
cd /var/www/recruitment-automation-backend

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Upload backend files to: /var/www/recruitment-automation-backend/backend/"
echo "2. Create .env file in backend directory"
echo "3. Run: cd backend && npm install --production"
echo "4. Run: pm2 start ecosystem.config.js"
echo ""
