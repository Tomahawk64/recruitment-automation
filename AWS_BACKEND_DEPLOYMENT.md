# 🚀 AWS EC2 Backend Deployment Guide

Complete guide to deploy the Recruitment Automation backend on AWS Ubuntu server.

**Server IP**: `13.61.100.205`

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ SSH access to the AWS EC2 instance
- ✅ MongoDB Atlas connection string
- ✅ Ubuntu 20.04 or later running on EC2
- ✅ Security Group configured to allow:
  - Port 22 (SSH)
  - Port 4000 (Backend API)
  - Port 80 (HTTP) - Optional for Nginx reverse proxy

---

## 🔧 Part 1: Server Setup

### Step 1: Connect to Your Server

Using PowerShell:
```powershell
ssh -i "your-key.pem" ubuntu@13.61.100.205
```

Or if using password:
```powershell
ssh ubuntu@13.61.100.205
```

### Step 2: Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### Step 3: Install Node.js (v18 LTS)

```bash
# Install Node.js from NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

### Step 4: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 5: Install Git (if not already installed)

```bash
sudo apt install git -y
git --version
```

---

## 📦 Part 2: Deploy Backend Application

### Step 1: Create Application Directory

```bash
# Create app directory
sudo mkdir -p /var/www/recruitment-automation-backend
sudo chown -R $USER:$USER /var/www/recruitment-automation-backend
cd /var/www/recruitment-automation-backend
```

### Step 2: Upload Backend Files

**Option A: Using Git (Recommended)**

```bash
# Clone your repository (replace with your repo URL)
git clone https://github.com/YOUR_USERNAME/recruitment-automation.git .
cd backend
```

**Option B: Using SCP from Local Machine**

From your Windows machine (PowerShell):
```powershell
scp -i "your-key.pem" -r C:\Users\HP\Downloads\recruitment-automation\backend\* ubuntu@13.61.100.205:/var/www/recruitment-automation-backend/
```

### Step 3: Install Dependencies

```bash
# Make sure you're in the backend directory
cd /var/www/recruitment-automation-backend/backend

# Install production dependencies
npm install --production
```

### Step 4: Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add the following content (press Ctrl+X, Y, Enter to save):

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://RGdebtRelief:Admin123@rgdebtrelief.qyjunw9.mongodb.net/invoicetest?retryWrites=true&w=majority&appName=invoicetest

# Server Configuration
PORT=4000
NODE_ENV=production

# JWT Secret (Change this to a secure random string!)
JWT_SECRET=your-super-secure-random-secret-key-change-this-123456789

# CORS Configuration - Frontend URL on Render
FRONTEND_URL=https://recruitment-automation-frontend.onrender.com
```

**⚠️ SECURITY WARNING**: 
- Change `JWT_SECRET` to a strong random string (minimum 32 characters)
- Generate secure key: `openssl rand -base64 32`

### Step 5: Test the Application

```bash
# Test run to ensure no errors
node server-mongodb.js
```

If it shows "Server running on port 4000", press `Ctrl+C` to stop it.

---

## 🔄 Part 3: Configure PM2 for Auto-Restart

### Step 1: Start Application with PM2

```bash
# Start the application
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs recruitment-automation-backend
```

### Step 2: Configure PM2 to Start on Boot

```bash
# Generate startup script
pm2 startup systemd

# Copy and run the command PM2 shows you (it will look like):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Save current PM2 process list
pm2 save
```

### Step 3: Verify PM2 Configuration

```bash
# List all PM2 processes
pm2 list

# Check if auto-restart is working
pm2 restart recruitment-automation-backend
pm2 status
```

---

## 🔒 Part 4: Configure Firewall (UFW)

### Step 1: Enable UFW

```bash
# Allow SSH first (IMPORTANT!)
sudo ufw allow 22/tcp

# Allow backend port
sudo ufw allow 4000/tcp

# Allow HTTP (if using Nginx)
sudo ufw allow 80/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## 🌐 Part 5: (Optional) Configure Nginx Reverse Proxy

If you want to access backend via port 80 with SSL:

### Step 1: Install Nginx

```bash
sudo apt install nginx -y
```

### Step 2: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/recruitment-automation
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name 13.61.100.205;

    location / {
        proxy_pass http://localhost:4000;
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
```

### Step 3: Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/recruitment-automation /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx on boot
sudo systemctl enable nginx
```

---

## ✅ Part 6: Verify Deployment

### Test Backend API

```bash
# Test from server
curl http://localhost:4000/health

# Test from external (replace with your IP)
curl http://13.61.100.205:4000/health
```

You should see: `{"status":"OK","timestamp":"..."}`

### Test from Windows PowerShell

```powershell
Invoke-WebRequest -Uri "http://13.61.100.205:4000/health"
```

---

## 📊 Part 7: Monitoring & Management

### Useful PM2 Commands

```bash
# View logs
pm2 logs recruitment-automation-backend

# View logs in real-time
pm2 logs recruitment-automation-backend --lines 100

# Restart application
pm2 restart recruitment-automation-backend

# Stop application
pm2 stop recruitment-automation-backend

# Delete from PM2
pm2 delete recruitment-automation-backend

# Monitor resources
pm2 monit
```

### Check System Resources

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top
```

---

## 🔄 Part 8: Update Backend Code

When you need to update the backend:

```bash
# Navigate to backend directory
cd /var/www/recruitment-automation-backend/backend

# Pull latest changes (if using Git)
git pull

# Install any new dependencies
npm install --production

# Restart with PM2
pm2 restart recruitment-automation-backend

# View logs to ensure everything is working
pm2 logs recruitment-automation-backend --lines 50
```

---

## 🐛 Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs recruitment-automation-backend

# Check if port 4000 is in use
sudo lsof -i :4000

# Kill process on port 4000 if needed
sudo kill -9 $(sudo lsof -t -i:4000)

# Restart PM2
pm2 restart recruitment-automation-backend
```

### MongoDB Connection Issues

```bash
# Test MongoDB connection
node -e "const mongoose = require('mongoose'); mongoose.connect('YOUR_MONGO_URI').then(() => console.log('Connected!')).catch(err => console.error(err));"
```

### Check Environment Variables

```bash
# View environment variables
pm2 env 0  # Replace 0 with your app ID from pm2 list
```

### PM2 Not Starting on Boot

```bash
# Re-run startup command
pm2 startup systemd
# Run the command it generates
pm2 save
```

---

## 🔐 Security Checklist

- [ ] Changed default JWT_SECRET in .env
- [ ] MongoDB connection uses strong credentials
- [ ] UFW firewall is enabled
- [ ] Only necessary ports are open (22, 4000)
- [ ] Regular system updates scheduled
- [ ] PM2 configured for auto-restart
- [ ] Application logs are being monitored

---

## 📝 Important URLs

- **Backend API**: `http://13.61.100.205:4000`
- **Health Check**: `http://13.61.100.205:4000/health`
- **API Base**: `http://13.61.100.205:4000/api`

---

## 🎯 Next Steps

1. ✅ Backend deployed on AWS EC2
2. ➡️ Deploy frontend on Render (see RENDER_FRONTEND_DEPLOYMENT.md)
3. ➡️ Update frontend environment to point to this backend
4. ➡️ Test end-to-end functionality

---

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs recruitment-automation-backend`
2. Check system logs: `sudo journalctl -u pm2-ubuntu`
3. Verify all environment variables in `.env`
4. Ensure MongoDB Atlas allows connections from your EC2 IP

---

**Deployment Date**: _[Add date when deployed]_  
**Last Updated**: October 26, 2025
