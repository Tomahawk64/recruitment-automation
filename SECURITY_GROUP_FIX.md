# 🔒 AWS Security Group Configuration Fix

## Problem
Backend API on port 4000 is not accessible because AWS Security Group doesn't allow inbound traffic on port 4000.

---

## Solution 1: Add Port 4000 to Security Group (Quick Fix)

### Steps:

1. **Open AWS Console**
   - Go to: https://console.aws.amazon.com/ec2/
   - Navigate to: **EC2 Dashboard** → **Network & Security** → **Security Groups**

2. **Find Your Security Group**
   - Look for the security group attached to your EC2 instance (IP: 13.61.100.205)
   - Click on the security group ID

3. **Edit Inbound Rules**
   - Click **"Inbound rules"** tab
   - Click **"Edit inbound rules"** button

4. **Add New Rule**
   - Click **"Add rule"**
   - Configure:
     ```
     Type: Custom TCP
     Protocol: TCP
     Port range: 4000
     Source: 0.0.0.0/0
     Description: Backend API
     ```

5. **Save Rules**
   - Click **"Save rules"**
   - Wait 10-20 seconds for changes to propagate

6. **Test Connection**
   ```powershell
   Invoke-WebRequest -Uri "http://13.61.100.205:4000/health"
   ```

### Visual Reference:

Your security group should look like this:

```
Inbound Rules:
┌────────────┬──────────┬───────────┬──────────┬─────────────┐
│ Type       │ Protocol │ Port Range│ Source   │ Description │
├────────────┼──────────┼───────────┼──────────┼─────────────┤
│ SSH        │ TCP      │ 22        │ 0.0.0.0/0│ SSH Access  │
│ HTTP       │ TCP      │ 80        │ 0.0.0.0/0│ HTTP        │
│ HTTPS      │ TCP      │ 443       │ 0.0.0.0/0│ HTTPS       │
│ Custom TCP │ TCP      │ 4000      │ 0.0.0.0/0│ Backend API │ ← ADD THIS
└────────────┴──────────┴───────────┴──────────┴─────────────┘
```

---

## Solution 2: Use Nginx Reverse Proxy (Recommended)

This is more secure as you don't expose port 4000 directly.

### Steps:

#### 1. SSH to Your Server
```bash
ssh ubuntu@13.61.100.205
```

#### 2. Install Nginx
```bash
sudo apt update
sudo apt install nginx -y
```

#### 3. Configure Nginx
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

#### 4. Enable the Configuration
```bash
sudo ln -s /etc/nginx/sites-available/recruitment-automation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Update Frontend Environment Variable on Render

Change `VITE_API_URL` from:
```
http://13.61.100.205:4000
```

To:
```
http://13.61.100.205
```

#### 6. Redeploy Frontend on Render
- Go to Render Dashboard
- Click "Manual Deploy" → "Clear build cache & deploy"

---

## Verification Steps

### Test Backend Directly

**With Port 4000 (Solution 1):**
```powershell
Invoke-WebRequest -Uri "http://13.61.100.205:4000/health"
```

**With Nginx (Solution 2):**
```powershell
Invoke-WebRequest -Uri "http://13.61.100.205/health"
```

Expected response:
```json
{"status":"OK","timestamp":"2025-10-26T..."}
```

### Test from Frontend

1. Open: https://recruitment-automation-frontend.onrender.com
2. Open Browser Console (F12)
3. Navigate to Network tab
4. Try to load data
5. Check if API calls succeed (status 200)

---

## Current Status

Based on your security group screenshot:

✅ Port 22 (SSH) - Open  
✅ Port 80 (HTTP) - Open  
✅ Port 443 (HTTPS) - Open  
❌ Port 4000 (Backend) - **BLOCKED** ← This is the issue!

---

## Troubleshooting

### Issue: Still can't connect after adding port 4000

**Check if backend is running:**
```bash
ssh ubuntu@13.61.100.205
pm2 status
```

**Check if backend is listening on port 4000:**
```bash
sudo lsof -i :4000
# or
sudo netstat -tlnp | grep 4000
```

**Check backend logs:**
```bash
pm2 logs recruitment-automation-backend --lines 50
```

### Issue: Connection timeout

- Verify the security group is attached to your EC2 instance
- Check VPC and subnet settings
- Ensure backend is binding to 0.0.0.0 (not just localhost)

### Issue: CORS errors in frontend

**Update backend .env:**
```bash
ssh ubuntu@13.61.100.205
cd /var/www/recruitment-automation-backend/backend
nano .env
```

Make sure this line is correct:
```env
FRONTEND_URL=https://recruitment-automation-frontend.onrender.com
```

Restart backend:
```bash
pm2 restart recruitment-automation-backend
```

---

## Security Best Practices

### If Using Solution 1 (Port 4000 directly):
- ⚠️ Your API is directly exposed
- Consider restricting source to specific IPs if possible
- Use HTTPS with SSL certificate (Let's Encrypt)

### If Using Solution 2 (Nginx Proxy):
- ✅ More secure - port 4000 only accessible internally
- ✅ Can add SSL easily with Certbot
- ✅ Can add rate limiting
- ✅ Better for production

---

## Recommended Approach

**For Quick Testing:** Use Solution 1 (Add port 4000)

**For Production:** Use Solution 2 (Nginx proxy)

---

## Next Steps

1. ✅ Add port 4000 to security group **OR** install Nginx
2. ✅ Verify backend is accessible
3. ✅ Test from PowerShell: `Invoke-WebRequest -Uri "http://13.61.100.205:4000/health"`
4. ✅ Test from frontend in browser
5. ✅ Check for CORS errors in console

---

**Created**: October 26, 2025  
**Issue**: Port 4000 blocked by AWS Security Group  
**Status**: Awaiting security group update
