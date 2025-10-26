# 🚀 Complete AWS Deployment Guide
## Deploy Both Frontend and Backend on Single AWS Server

**Server IP**: 13.61.100.205  
**Backend**: PM2 (Node.js on port 4000)  
**Frontend**: Nginx (Static files)  
**SSL**: Self-signed certificate (HTTPS)

---

## Architecture

```
                    USERS
                      ↓
                   HTTPS (443)
                      ↓
              ┌──────────────────┐
              │   AWS EC2 Server │
              │  13.61.100.205   │
              └──────────────────┘
                      ↓
              ┌──────────────────┐
              │      Nginx       │
              │   (Port 443)     │
              └──────────────────┘
                 ↓              ↓
         /api routes       / (root)
                 ↓              ↓
         ┌─────────────┐  ┌──────────┐
         │  Backend    │  │ Frontend │
         │  (PM2:4000) │  │  (Static)│
         └─────────────┘  └──────────┘
                 ↓
         ┌─────────────┐
         │  MongoDB    │
         │   Atlas     │
         └─────────────┘
```

---

## Prerequisites

- ✅ AWS EC2 instance running Ubuntu
- ✅ SSH access
- ✅ Security Group allows ports: 22, 80, 443
- ✅ MongoDB Atlas connection string

---

## Part 1: Server Setup (One Time)

### Step 1: Connect to Server

```bash
ssh ubuntu@13.61.100.205
```

### Step 2: Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### Step 3: Install Node.js 18

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should show v18.x.x
npm --version
```

### Step 4: Install PM2

```bash
sudo npm install -g pm2
pm2 --version
```

### Step 5: Install Nginx

```bash
sudo apt install nginx -y
nginx -v
```

### Step 6: Install Git (if not installed)

```bash
sudo apt install git -y
```

---

## Part 2: Deploy Backend

### Step 1: Create Application Directory

```bash
sudo mkdir -p /var/www/recruitment-automation
sudo chown -R $USER:$USER /var/www/recruitment-automation
cd /var/www/recruitment-automation
```

### Step 2: Clone Repository

```bash
# Clone your repository
git clone https://github.com/Tomahawk64/recruitment-automation.git .

# Or if already cloned, pull latest
git pull origin main
```

### Step 3: Setup Backend

```bash
cd /var/www/recruitment-automation/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
```

**Paste this content** (update with your actual values):

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://RGdebtRelief:Admin123@rgdebtrelief.qyjunw9.mongodb.net/invoicetest?retryWrites=true&w=majority&appName=invoicetest

# Server Configuration
PORT=4000
NODE_ENV=production

# JWT Secret - CHANGE THIS!
JWT_SECRET=your-super-secure-random-secret-key-change-this-to-something-very-long-and-random

# CORS Configuration - Frontend URL (same server with HTTPS)
FRONTEND_URL=https://13.61.100.205
```

**Save**: `Ctrl+X`, then `Y`, then `Enter`

### Step 4: Test Backend

```bash
# Test run
node server-mongodb.js
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 4000
```

Press `Ctrl+C` to stop.

### Step 5: Start Backend with PM2

```bash
pm2 start ecosystem.config.js
pm2 status
pm2 logs recruitment-automation-backend --lines 20
```

### Step 6: Configure PM2 Startup

```bash
pm2 startup systemd
# Copy and run the command it shows you
pm2 save
```

### Step 7: Create Logs Directory

```bash
mkdir -p /var/www/recruitment-automation/backend/logs
```

---

## Part 3: Deploy Frontend

### Step 1: Build Frontend

```bash
cd /var/www/recruitment-automation/frontend

# Install dependencies
npm install

# Build production version
npm run build
```

This creates a `dist` folder with the built frontend.

### Step 2: Verify Build

```bash
ls -la dist/
# Should see: index.html, assets/, etc.
```

---

## Part 4: Configure Nginx with SSL

### Step 1: Generate SSL Certificate

```bash
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/nginx.key \
  -out /etc/nginx/ssl/nginx.crt \
  -subj "/C=IN/ST=Delhi/L=Delhi/O=RecruitmentAutomation/CN=13.61.100.205"
```

### Step 2: Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/recruitment-automation
```

**Paste this complete configuration**:

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name 13.61.100.205;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl;
    server_name 13.61.100.205;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend - Serve React app
    root /var/www/recruitment-automation/frontend/dist;
    index index.html;

    # Frontend routes - React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
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

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Save**: `Ctrl+X`, then `Y`, then `Enter`

### Step 3: Enable Configuration

```bash
# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Enable our configuration
sudo ln -s /etc/nginx/sites-available/recruitment-automation /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t
```

Should show:
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Step 4: Restart Nginx

```bash
sudo systemctl restart nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

Press `q` to exit status view.

---

## Part 5: Configure Firewall

### Step 1: Enable UFW

```bash
# Allow SSH first (IMPORTANT!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Part 6: Testing

### Step 1: Test from Server

```bash
# Test backend
curl http://localhost:4000/health

# Test HTTPS
curl -k https://localhost/health

# Exit SSH
exit
```

### Step 2: Test from Your Computer

```powershell
# Test HTTPS (ignore certificate warning for now)
Invoke-WebRequest -Uri "https://13.61.100.205/health" -SkipCertificateCheck
```

### Step 3: Test in Browser

1. Open: **https://13.61.100.205**
2. You'll see a certificate warning - Click **"Advanced"**
3. Click **"Proceed to 13.61.100.205 (unsafe)"**
4. Frontend should load!
5. Open Console (F12) - Check for errors
6. Try navigating to different pages

---

## Part 7: Updating Your Application

### Update Backend

```bash
ssh ubuntu@13.61.100.205
cd /var/www/recruitment-automation
git pull origin main
cd backend
npm install --production
pm2 restart recruitment-automation-backend
pm2 logs recruitment-automation-backend --lines 30
exit
```

### Update Frontend

```bash
ssh ubuntu@13.61.100.205
cd /var/www/recruitment-automation
git pull origin main
cd frontend
npm install
npm run build
sudo systemctl reload nginx
exit
```

### Or Both at Once

```bash
ssh ubuntu@13.61.100.205
cd /var/www/recruitment-automation
git pull origin main

# Backend
cd backend
npm install --production
pm2 restart recruitment-automation-backend

# Frontend
cd ../frontend
npm install
npm run build

# Reload Nginx
sudo systemctl reload nginx

# Check status
pm2 status
exit
```

---

## Troubleshooting

### Backend Not Starting

```bash
ssh ubuntu@13.61.100.205

# Check PM2 logs
pm2 logs recruitment-automation-backend

# Check if MongoDB connection works
cd /var/www/recruitment-automation/backend
node server-mongodb.js

# Restart
pm2 restart recruitment-automation-backend
pm2 status
```

### Frontend Not Loading

```bash
ssh ubuntu@13.61.100.205

# Check if build exists
ls -la /var/www/recruitment-automation/frontend/dist/

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl status nginx
```

### Nginx Configuration Issues

```bash
# Check Nginx syntax
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Restart Nginx
sudo systemctl restart nginx
```

### Port Issues

```bash
# Check what's using port 4000
sudo lsof -i :4000

# Check what's using port 443
sudo lsof -i :443

# Kill process if needed
sudo kill -9 <PID>
```

---

## Monitoring

### Check Backend Status

```bash
ssh ubuntu@13.61.100.205
pm2 status
pm2 monit  # Real-time monitoring
pm2 logs recruitment-automation-backend --lines 50
```

### Check Nginx Status

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Check System Resources

```bash
# Disk space
df -h

# Memory usage
free -h

# CPU usage
top
# Press 'q' to exit
```

---

## Security Notes

### Certificate Warning

⚠️ **Self-signed certificate will show browser warnings**

Users need to:
1. Click "Advanced"
2. Click "Proceed to 13.61.100.205 (unsafe)"

This is safe - it's your own server. Traffic is encrypted.

### To Remove Certificate Warning (Optional)

You need a domain name:

1. Buy a domain (e.g., myapp.com)
2. Point it to 13.61.100.205
3. Install Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d myapp.com
```

Certbot will automatically configure SSL with a trusted certificate!

---

## Backup

### Backup Configuration

```bash
# From your server
ssh ubuntu@13.61.100.205

# Backup .env file
cp /var/www/recruitment-automation/backend/.env ~/backend-env-backup.txt

# Backup Nginx config
sudo cp /etc/nginx/sites-available/recruitment-automation ~/nginx-config-backup.txt

# Download to your computer
exit

# From PowerShell
scp ubuntu@13.61.100.205:~/backend-env-backup.txt C:\backup\
scp ubuntu@13.61.100.205:~/nginx-config-backup.txt C:\backup\
```

---

## Complete Checklist

### Initial Setup
- [ ] Connected to AWS server via SSH
- [ ] Installed Node.js 18
- [ ] Installed PM2
- [ ] Installed Nginx
- [ ] Cloned repository
- [ ] Configured backend .env
- [ ] Started backend with PM2
- [ ] Built frontend
- [ ] Generated SSL certificate
- [ ] Configured Nginx
- [ ] Enabled UFW firewall
- [ ] Tested in browser

### Verification
- [ ] Backend health check works: `https://13.61.100.205/health`
- [ ] Frontend loads: `https://13.61.100.205`
- [ ] Can navigate between pages
- [ ] Dashboard loads data
- [ ] No console errors (except certificate warning)
- [ ] API calls work (Network tab)

---

## Quick Reference

### URLs
- **Frontend**: https://13.61.100.205
- **Backend API**: https://13.61.100.205/api
- **Health Check**: https://13.61.100.205/health

### Commands

```bash
# Backend
pm2 status
pm2 restart recruitment-automation-backend
pm2 logs recruitment-automation-backend

# Frontend
cd /var/www/recruitment-automation/frontend
npm run build
sudo systemctl reload nginx

# Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx

# Logs
sudo tail -f /var/log/nginx/error.log
pm2 logs recruitment-automation-backend --lines 50

# Update
cd /var/www/recruitment-automation
git pull origin main
```

---

## Next Steps

After successful deployment:

1. ✅ Test all features thoroughly
2. ✅ Monitor backend logs for errors
3. ✅ Consider getting a domain name
4. ✅ Setup automated backups
5. ✅ Monitor server resources
6. ✅ Setup log rotation

---

**Deployment Date**: _[Add date when deployed]_  
**Server IP**: 13.61.100.205  
**Status**: Ready for deployment

**Estimated Time**: 45-60 minutes for first-time setup
