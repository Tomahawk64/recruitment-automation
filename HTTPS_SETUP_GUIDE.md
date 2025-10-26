# 🔒 HTTPS Setup Guide for AWS Backend

## Problem: Mixed Content Error

Your frontend (HTTPS) cannot call your backend (HTTP). Browsers block this for security.

**Error:**
```
Mixed Content: The page at 'https://recruitment-automation-frontend.onrender.com' 
was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 
'http://13.61.100.205:4000'. This request has been blocked.
```

---

## ✅ Solution: Add HTTPS to Backend with Nginx + Let's Encrypt

### Prerequisites
- Domain name pointing to your AWS server (optional but recommended)
- SSH access to AWS EC2 (13.61.100.205)
- Port 80 and 443 open in security group ✅ (you already have these)

---

## Option 1: Using Nginx Reverse Proxy with Self-Signed SSL (Quick)

### Step 1: SSH to Server
```bash
ssh ubuntu@13.61.100.205
```

### Step 2: Install Nginx
```bash
sudo apt update
sudo apt install nginx -y
```

### Step 3: Generate Self-Signed Certificate
```bash
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/nginx.key \
  -out /etc/nginx/ssl/nginx.crt \
  -subj "/C=IN/ST=State/L=City/O=Organization/CN=13.61.100.205"
```

### Step 4: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/recruitment-automation
```

Paste this configuration:
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

    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Proxy to backend
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
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://recruitment-automation-frontend.onrender.com' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

### Step 5: Enable Configuration
```bash
sudo ln -s /etc/nginx/sites-available/recruitment-automation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Step 6: Update Render Frontend Environment Variable

Go to Render Dashboard → Your Static Site → Environment

Change:
```
VITE_API_URL=http://13.61.100.205:4000
```

To:
```
VITE_API_URL=https://13.61.100.205
```

### Step 7: Redeploy Frontend

In Render Dashboard:
- Click "Manual Deploy"
- Select "Clear build cache & deploy"

### Step 8: Update Local .env.example

```bash
# Update frontend/.env.example
VITE_API_URL=https://13.61.100.205
```

---

## ⚠️ Important Note About Self-Signed Certificates

Browsers will show a security warning because the certificate is self-signed. Users need to:

1. Click "Advanced"
2. Click "Proceed to 13.61.100.205 (unsafe)"

**For production, you need a real domain and Let's Encrypt certificate.**

---

## Option 2: Using Domain Name + Let's Encrypt SSL (Production)

### If you have a domain name (e.g., api.yourdomain.com):

### Step 1: Point Domain to Server
In your domain registrar (GoDaddy, Namecheap, etc.):

Add A record:
```
Type: A
Name: api (or @)
Value: 13.61.100.205
TTL: 3600
```

### Step 2: SSH to Server
```bash
ssh ubuntu@13.61.100.205
```

### Step 3: Install Nginx and Certbot
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Step 4: Configure Nginx (without SSL first)
```bash
sudo nano /etc/nginx/sites-available/recruitment-automation
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Replace with your domain

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

### Step 5: Enable Configuration
```bash
sudo ln -s /etc/nginx/sites-available/recruitment-automation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Get SSL Certificate from Let's Encrypt
```bash
sudo certbot --nginx -d api.yourdomain.com
```

Follow the prompts:
- Enter email address
- Agree to terms
- Choose to redirect HTTP to HTTPS

Certbot will automatically configure SSL!

### Step 7: Update Render Environment Variable
```
VITE_API_URL=https://api.yourdomain.com
```

### Step 8: Redeploy Frontend
Click "Manual Deploy" in Render Dashboard

---

## Option 3: Quick Workaround - Deploy Backend on Render Too

If you don't want to setup SSL on AWS, deploy backend on Render (gets automatic HTTPS):

### Step 1: Create New Web Service on Render
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - Name: recruitment-automation-backend
   - Root Directory: backend
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

### Step 2: Add Environment Variables on Render
```
MONGO_URI=mongodb+srv://...
PORT=4000
NODE_ENV=production
JWT_SECRET=your-secret
FRONTEND_URL=https://recruitment-automation-frontend.onrender.com
```

### Step 3: Update Frontend Environment Variable
After backend deploys, copy the URL (e.g., https://recruitment-automation-backend.onrender.com)

Update frontend on Render:
```
VITE_API_URL=https://recruitment-automation-backend.onrender.com
```

### Step 4: Redeploy Frontend
Click "Manual Deploy"

---

## Verification Steps

### Test HTTPS Backend
```powershell
# With self-signed SSL
Invoke-WebRequest -Uri "https://13.61.100.205/health" -SkipCertificateCheck

# With Let's Encrypt or Render
Invoke-WebRequest -Uri "https://api.yourdomain.com/health"
# or
Invoke-WebRequest -Uri "https://your-backend.onrender.com/health"
```

### Test Frontend
1. Open: https://recruitment-automation-frontend.onrender.com
2. Open Browser Console (F12)
3. Check Network tab - should see HTTPS requests
4. No mixed content errors!

---

## Recommended Solution

**For Quick Testing:**
→ Option 1: Self-signed SSL on AWS (30 minutes)

**For Production:**
→ Option 2: Domain + Let's Encrypt (if you have domain)
→ Option 3: Deploy backend on Render (easiest, automatic HTTPS)

---

## Current Workaround (Temporary)

While setting up HTTPS, you can temporarily test by disabling mixed content blocking:

**Chrome:**
1. Open site
2. Click the lock icon → Site settings
3. Scroll to "Insecure content"
4. Change to "Allow"

**⚠️ This is NOT a solution - only for testing!**

---

## Security Considerations

### Self-Signed Certificate:
- ⚠️ Browser warnings
- ⚠️ Users must manually accept certificate
- ✅ Traffic is encrypted
- ⚠️ Not recommended for public production

### Let's Encrypt Certificate:
- ✅ Free
- ✅ Trusted by all browsers
- ✅ Auto-renewal
- ✅ Production-ready
- ⚠️ Requires domain name

### Render Backend:
- ✅ Automatic HTTPS
- ✅ Free tier available
- ✅ Auto-deploy from GitHub
- ⚠️ Free tier sleeps after 15 min inactivity
- ✅ Perfect for testing/small apps

---

## Next Steps

Choose one option and follow the steps. I recommend:

1. **Quick Test:** Option 1 (Self-signed SSL) - 30 minutes
2. **Production:** Option 3 (Backend on Render) - 20 minutes
3. **With Domain:** Option 2 (Let's Encrypt) - 45 minutes

After setup, your full stack will be:
- Frontend: HTTPS (Render) ✅
- Backend: HTTPS (AWS with SSL or Render) ✅
- Database: MongoDB Atlas ✅

---

**Created:** October 26, 2025  
**Issue:** Mixed Content - HTTP backend, HTTPS frontend  
**Status:** Choose and implement one solution above
