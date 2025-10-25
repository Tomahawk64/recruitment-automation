# 🚀 Render Frontend Deployment Guide

Complete guide to deploy the Recruitment Automation frontend on Render.

**Frontend URL**: `https://recruitment-automation-frontend.onrender.com`  
**Backend API**: `http://13.61.100.205:4000`

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Render account (sign up at [render.com](https://render.com))
- ✅ GitHub repository with your code
- ✅ Backend already deployed on AWS EC2 at `13.61.100.205`

---

## 🎯 Part 1: Push Code to GitHub

### Step 1: Initialize Git Repository (if not already done)

From PowerShell in your project directory:

```powershell
cd C:\Users\HP\Downloads\recruitment-automation

# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"
```

### Step 2: Push to GitHub

```powershell
# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/recruitment-automation.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## 🌐 Part 2: Deploy Frontend on Render

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

### Step 2: Create New Static Site

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** button (top right)
3. Select **"Static Site"**

### Step 3: Connect Repository

1. You'll see a list of your repositories
2. Find and click **"Connect"** next to `recruitment-automation`
3. If you don't see it, click **"Configure account"** and give Render access

### Step 4: Configure Build Settings

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `recruitment-automation-frontend` |
| **Region** | `Frankfurt (EU Central)` or closest to you |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `frontend/dist` |

⚠️ **Important**: Make sure "Publish Directory" is set to `frontend/dist` (not just `dist`)

### Step 5: Add Environment Variable

1. Scroll down to **"Environment Variables"** section
2. Click **"Add Environment Variable"**
3. Add the following:

```
Key: VITE_API_URL
Value: http://13.61.100.205:4000
```

⚠️ **Note**: We're using HTTP (not HTTPS) because the backend is on AWS without SSL certificate.

### Step 6: Configure Advanced Settings (Optional)

If you want to add custom redirects for React Router:

1. Click **"Advanced"**
2. Under **"Redirects/Rewrites"**, add:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`

This ensures React Router works correctly with direct URL access.

### Step 7: Create Static Site

1. Review all settings
2. Click **"Create Static Site"**
3. Render will start building your frontend (takes 3-5 minutes)

---

## 📊 Part 3: Monitor Deployment

### Watch Build Progress

1. You'll see a build log in real-time
2. Wait for the message: **"Your site is live"**
3. Expected build time: 3-5 minutes

### Common Build Steps You'll See

```
==> Cloning from https://github.com/...
==> Downloading cache...
==> Building...
    npm install
    npm run build
    > vite build
    ✓ built in 45s
==> Uploading build...
==> Build successful!
==> Deploying...
==> Deploy successful!
```

---

## ✅ Part 4: Verify Deployment

### Step 1: Access Your Frontend

1. Click on the URL shown at the top: `https://recruitment-automation-frontend.onrender.com`
2. Your frontend should load successfully

### Step 2: Test API Connection

1. Open browser console (F12)
2. Navigate through the application
3. Check that API calls to `http://13.61.100.205:4000` are working
4. If you see CORS errors, proceed to Part 5

---

## 🔧 Part 5: Update Backend CORS Settings

Your backend needs to allow requests from the Render frontend.

### On AWS EC2 Server

```bash
# SSH into your server
ssh ubuntu@13.61.100.205

# Navigate to backend directory
cd /var/www/recruitment-automation-backend/backend

# Edit .env file
nano .env
```

### Update FRONTEND_URL

Change the `FRONTEND_URL` line to:

```env
FRONTEND_URL=https://recruitment-automation-frontend.onrender.com
```

Save and exit (Ctrl+X, Y, Enter)

### Restart Backend

```bash
pm2 restart recruitment-automation-backend

# Verify it's running
pm2 logs recruitment-automation-backend --lines 20
```

---

## 🔄 Part 6: Update Frontend After Backend Changes

Sometimes you need to redeploy the frontend:

### Trigger Manual Redeploy

1. Go to Render Dashboard
2. Select your `recruitment-automation-frontend` site
3. Click **"Manual Deploy"** → **"Clear build cache & deploy"**

### Or Push Changes

```powershell
# Make any changes to frontend code
git add .
git commit -m "Update configuration"
git push origin main
```

Render automatically rebuilds on every git push!

---

## 🎨 Part 7: Custom Domain (Optional)

If you want to use a custom domain like `recruitment.yourdomain.com`:

### Step 1: Add Custom Domain in Render

1. Go to your static site settings
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter your domain: `recruitment.yourdomain.com`

### Step 2: Update DNS Records

In your domain registrar (e.g., GoDaddy, Namecheap):

1. Add a CNAME record:
   - **Name**: `recruitment`
   - **Value**: `recruitment-automation-frontend.onrender.com`
   - **TTL**: 3600

### Step 3: Update Backend CORS

Update the backend `.env` to include your custom domain:

```env
FRONTEND_URL=https://recruitment.yourdomain.com
```

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `npm install failed`
- Check that `package.json` is in the `frontend` directory
- Verify "Root Directory" is set to `frontend`
- Try **"Clear build cache & deploy"**

**Error**: `vite build failed`
- Check for TypeScript errors in your code
- Review build logs for specific error messages

### Site Loads But API Calls Fail

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`
- Verify backend `.env` has correct `FRONTEND_URL`
- Restart backend: `pm2 restart recruitment-automation-backend`
- Check backend logs: `pm2 logs recruitment-automation-backend`

**Error**: `Network Error` or `Failed to fetch`
- Verify backend is running: `curl http://13.61.100.205:4000/health`
- Check `VITE_API_URL` environment variable in Render
- Verify AWS Security Group allows port 4000

### Blank Page After Deployment

- Check browser console (F12) for errors
- Verify "Publish Directory" is `frontend/dist`
- Add redirect rule for React Router (see Step 6 above)

---

## 🔍 Monitoring & Logs

### View Deployment Logs

1. Go to Render Dashboard
2. Select your static site
3. Click **"Logs"** tab
4. Filter by "Builds" or "Deploys"

### Check Build Performance

1. Go to **"Settings"** tab
2. View **"Build & Deploy"** section
3. See build time and cache usage

---

## 🔐 Security Best Practices

- [ ] Environment variables are set correctly
- [ ] Backend CORS is configured properly
- [ ] No sensitive data in frontend code
- [ ] HTTPS is enabled (Render provides this automatically)
- [ ] API calls use environment variable, not hardcoded URLs

---

## 📝 Important URLs

- **Frontend URL**: `https://recruitment-automation-frontend.onrender.com`
- **Backend API**: `http://13.61.100.205:4000`
- **Health Check**: `http://13.61.100.205:4000/health`
- **Render Dashboard**: `https://dashboard.render.com`

---

## 🎯 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Static site created on Render
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `frontend/dist`
- [ ] Environment variable `VITE_API_URL` set to `http://13.61.100.205:4000`
- [ ] Backend CORS updated with frontend URL
- [ ] Frontend loads successfully
- [ ] API calls work without CORS errors
- [ ] All pages navigate correctly

---

## 🚀 Auto-Deploy Setup

Render automatically deploys when you push to GitHub!

Every time you run:
```powershell
git add .
git commit -m "Your changes"
git push origin main
```

Render will:
1. Detect the push
2. Start a new build
3. Run `npm install && npm run build`
4. Deploy the new version
5. Your site updates automatically!

---

## 💡 Tips for Success

1. **Free Tier Limitations**: 
   - Render free tier suspends after 15 minutes of inactivity
   - First request after suspension takes 30-60 seconds to wake up
   - Consider upgrading to paid tier for production

2. **Build Optimization**:
   - Render caches `node_modules` between builds
   - Builds are typically faster after the first deployment

3. **Environment Variables**:
   - Changes to environment variables require manual redeploy
   - Click "Manual Deploy" after updating env vars

4. **Branch Deployments**:
   - You can create preview deployments for different branches
   - Useful for testing before merging to main

---

## 🎉 Success!

Your frontend is now live at:
**https://recruitment-automation-frontend.onrender.com**

Connected to backend at:
**http://13.61.100.205:4000**

---

**Deployment Date**: _[Add date when deployed]_  
**Last Updated**: October 26, 2025
