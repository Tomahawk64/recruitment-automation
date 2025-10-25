# 🎯 Complete Deployment Guide

**Quick Start Guide for Deploying Recruitment Automation System**

- **Backend**: AWS EC2 Ubuntu Server (`13.61.100.205`)
- **Frontend**: Render Static Site (`https://recruitment-automation-frontend.onrender.com`)

---

## 📋 Overview

This is a two-part deployment:

1. **Backend API** → AWS EC2 Ubuntu Server (Node.js + MongoDB)
2. **Frontend App** → Render (React + Vite)

**Total Time**: ~30-45 minutes

---

## 🚀 Quick Start (TL;DR)

### Backend (AWS EC2)
```bash
# 1. SSH to server
ssh ubuntu@13.61.100.205

# 2. Install Node.js, PM2, and clone repo
# 3. Configure .env with MongoDB URI
# 4. Start with PM2

# Backend will be available at: http://13.61.100.205:4000
```

### Frontend (Render)
```bash
# 1. Push code to GitHub
# 2. Create Static Site on Render
# 3. Set Root Directory: frontend
# 4. Set VITE_API_URL: http://13.61.100.205:4000

# Frontend will be at: https://recruitment-automation-frontend.onrender.com
```

---

## 📚 Detailed Guides

### 1️⃣ Backend Deployment
👉 **See: [AWS_BACKEND_DEPLOYMENT.md](./AWS_BACKEND_DEPLOYMENT.md)**

Steps:
- Connect to AWS EC2 server
- Install Node.js, PM2, Git
- Upload backend code
- Configure environment variables
- Start with PM2 (auto-restart enabled)
- Configure firewall

**Result**: Backend API running at `http://13.61.100.205:4000`

---

### 2️⃣ Frontend Deployment  
👉 **See: [RENDER_FRONTEND_DEPLOYMENT.md](./RENDER_FRONTEND_DEPLOYMENT.md)**

Steps:
- Push code to GitHub
- Create Static Site on Render
- Configure build settings
- Set environment variables
- Deploy and verify

**Result**: Frontend app at `https://recruitment-automation-frontend.onrender.com`

---

## ✅ Pre-Deployment Checklist

### Before You Start

- [ ] MongoDB Atlas account and connection string ready
- [ ] AWS EC2 instance running Ubuntu (IP: 13.61.100.205)
- [ ] SSH access to AWS EC2 server
- [ ] AWS Security Group allows ports: 22, 4000
- [ ] GitHub account created
- [ ] Render account created (free tier is fine)
- [ ] Code is ready in: `C:\Users\HP\Downloads\recruitment-automation`

---

## 🎯 Deployment Order

Follow this exact order:

### Phase 1: Backend (30 minutes)
1. ✅ SSH into AWS EC2
2. ✅ Install dependencies (Node.js, PM2)
3. ✅ Upload backend code
4. ✅ Configure .env file
5. ✅ Start with PM2
6. ✅ Test API endpoint

### Phase 2: Frontend (15 minutes)
1. ✅ Push code to GitHub
2. ✅ Create Render Static Site
3. ✅ Configure build settings
4. ✅ Deploy frontend
5. ✅ Test application

### Phase 3: Integration (5 minutes)
1. ✅ Update backend CORS with frontend URL
2. ✅ Test API calls from frontend
3. ✅ Verify all features work

---

## 🔧 Configuration Summary

### Backend Environment Variables (.env)

```env
MONGO_URI=mongodb+srv://RGdebtRelief:Admin123@rgdebtrelief.qyjunw9.mongodb.net/invoicetest?retryWrites=true&w=majority&appName=invoicetest
PORT=4000
NODE_ENV=production
JWT_SECRET=your-super-secure-random-secret-key-change-this
FRONTEND_URL=https://recruitment-automation-frontend.onrender.com
```

⚠️ **Change `JWT_SECRET` to a secure random string!**

### Frontend Environment Variables (Render)

```env
VITE_API_URL=http://13.61.100.205:4000
```

---

## 🌐 Final URLs

After successful deployment:

| Service | URL | Status |
|---------|-----|--------|
| Frontend | `https://recruitment-automation-frontend.onrender.com` | ✅ Public |
| Backend API | `http://13.61.100.205:4000` | ✅ Public |
| Health Check | `http://13.61.100.205:4000/health` | ✅ Public |
| API Endpoint | `http://13.61.100.205:4000/api` | ✅ Public |

---

## 🧪 Testing Your Deployment

### Test Backend

From PowerShell:
```powershell
# Test health endpoint
Invoke-WebRequest -Uri "http://13.61.100.205:4000/health"

# Should return: {"status":"OK","timestamp":"..."}
```

### Test Frontend

1. Open browser: `https://recruitment-automation-frontend.onrender.com`
2. Check dashboard loads
3. Try creating a closure
4. Check console for errors (F12)

### Test Integration

1. Open frontend in browser
2. Open Developer Console (F12)
3. Navigate to different pages
4. Verify API calls succeed (Network tab)
5. Check for CORS errors (should be none)

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error in Frontend

**Symptom**: Console shows "CORS policy: No 'Access-Control-Allow-Origin'"

**Solution**:
```bash
# SSH to AWS server
ssh ubuntu@13.61.100.205

# Edit backend .env
cd /var/www/recruitment-automation-backend/backend
nano .env

# Make sure FRONTEND_URL is set correctly:
FRONTEND_URL=https://recruitment-automation-frontend.onrender.com

# Restart backend
pm2 restart recruitment-automation-backend
```

---

### Issue: Backend Not Starting

**Symptom**: PM2 shows app as "errored" or "stopped"

**Solution**:
```bash
# Check logs
pm2 logs recruitment-automation-backend

# Common fixes:
# 1. Check MongoDB connection in .env
# 2. Ensure port 4000 is not in use
# 3. Verify all dependencies installed

# Restart
pm2 restart recruitment-automation-backend
```

---

### Issue: Frontend Build Fails on Render

**Symptom**: Build logs show errors

**Solution**:
1. Check "Root Directory" is set to `frontend`
2. Verify "Publish Directory" is `frontend/dist`
3. Try "Clear build cache & deploy"
4. Check package.json is in frontend folder

---

## 📊 Monitoring After Deployment

### Backend Monitoring (AWS)

```bash
# SSH to server
ssh ubuntu@13.61.100.205

# Check PM2 status
pm2 status

# View logs
pm2 logs recruitment-automation-backend --lines 50

# Monitor resources
pm2 monit
```

### Frontend Monitoring (Render)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your static site
3. View "Logs" tab for access logs
4. Check "Metrics" for traffic stats

---

## 🔄 Making Updates

### Update Backend Code

```bash
# SSH to server
ssh ubuntu@13.61.100.205

# Navigate to backend
cd /var/www/recruitment-automation-backend/backend

# Pull latest changes (if using Git)
git pull

# Or upload new files via SCP

# Restart
pm2 restart recruitment-automation-backend
```

### Update Frontend Code

```powershell
# From your local machine
cd C:\Users\HP\Downloads\recruitment-automation

# Make changes, then:
git add .
git commit -m "Update frontend"
git push origin main

# Render automatically rebuilds and deploys!
```

---

## 🔐 Security Checklist

Post-Deployment Security:

- [ ] Changed default JWT_SECRET in backend .env
- [ ] MongoDB uses strong credentials
- [ ] AWS Security Group only allows necessary ports
- [ ] UFW firewall enabled on EC2
- [ ] Backend only accepts requests from frontend domain
- [ ] No sensitive data exposed in frontend code
- [ ] HTTPS enabled for frontend (Render does this automatically)
- [ ] Regular system updates scheduled on EC2

---

## 💰 Cost Estimate

### Current Setup (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| AWS EC2 | t2.micro / t3.micro | $8-10/month |
| MongoDB Atlas | Free Tier (M0) | $0 |
| Render Frontend | Free Tier | $0 |
| **Total** | | **~$8-10/month** |

⚠️ **Notes**:
- Render free tier sleeps after 15 min inactivity
- For production, consider Render paid tier ($7/month)
- AWS free tier available for first 12 months

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Backend health check responds: `http://13.61.100.205:4000/health`
- ✅ Frontend loads: `https://recruitment-automation-frontend.onrender.com`
- ✅ Can view dashboard
- ✅ Can create/edit closures
- ✅ Can generate invoices
- ✅ No CORS errors in browser console
- ✅ All API calls succeed
- ✅ PM2 shows backend running on AWS
- ✅ Backend auto-restarts on server reboot

---

## 📞 Support Resources

### Documentation
- AWS EC2: https://docs.aws.amazon.com/ec2/
- Render: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/

### Useful Commands

**AWS EC2**:
```bash
pm2 status              # Check app status
pm2 logs                # View logs
pm2 restart all         # Restart all apps
pm2 monit               # Monitor resources
```

**Render**:
- Dashboard: https://dashboard.render.com
- Manual Deploy: Click button in dashboard
- View Logs: Logs tab in dashboard

---

## 📝 Deployment Checklist

Print this and check off as you go:

### Backend (AWS EC2)
- [ ] Connected to server via SSH
- [ ] Installed Node.js v18
- [ ] Installed PM2
- [ ] Created app directory
- [ ] Uploaded backend files
- [ ] Installed dependencies (`npm install`)
- [ ] Created .env file with correct values
- [ ] Changed JWT_SECRET to secure value
- [ ] Started app with PM2
- [ ] Configured PM2 startup script
- [ ] Enabled UFW firewall
- [ ] Tested health endpoint
- [ ] PM2 shows status as "online"

### Frontend (Render)
- [ ] Pushed code to GitHub
- [ ] Created Render account
- [ ] Created new Static Site
- [ ] Connected GitHub repository
- [ ] Set Root Directory to `frontend`
- [ ] Set Build Command to `npm install && npm run build`
- [ ] Set Publish Directory to `frontend/dist`
- [ ] Added VITE_API_URL environment variable
- [ ] Deployed successfully
- [ ] Frontend loads in browser
- [ ] No CORS errors

### Integration
- [ ] Updated backend FRONTEND_URL
- [ ] Restarted backend
- [ ] Tested API calls from frontend
- [ ] All features working
- [ ] No console errors

---

## 🎓 Next Steps

After deployment:

1. **Monitor for 24 hours**: Check logs regularly
2. **Test all features**: Closures, invoices, reports
3. **Setup backups**: Configure MongoDB Atlas backups
4. **Add monitoring**: Consider services like UptimeRobot
5. **Document issues**: Keep notes of any problems
6. **Plan updates**: Schedule regular maintenance

---

## 🌟 Optional Enhancements

Consider these after stable deployment:

### Backend Improvements
- [ ] Add SSL certificate (Let's Encrypt)
- [ ] Setup Nginx reverse proxy
- [ ] Configure custom domain
- [ ] Add API rate limiting
- [ ] Setup log rotation
- [ ] Configure automated backups

### Frontend Improvements
- [ ] Add custom domain
- [ ] Enable CDN (Render Pro)
- [ ] Add error tracking (Sentry)
- [ ] Setup analytics (Google Analytics)
- [ ] Add progressive web app (PWA) features

---

**Created**: October 26, 2025  
**Version**: 1.0  
**Status**: Ready for deployment

Good luck with your deployment! 🚀
