# 🚀 Render Deployment Guide

This guide will help you deploy the Recruitment Automation System on Render with:
- **Backend**: Web Service (Node.js API)
- **Frontend**: Static Site (React/Vite)

---

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push this project to GitHub
3. **MongoDB Atlas**: Your connection string (already configured)

---

## 🎯 Deployment Steps

### **Part 1: Deploy Backend (Web Service)**

#### Step 1: Create New Web Service
1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the **recruitment-automation** repository

#### Step 2: Configure Backend Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `recruitment-automation-backend` (or your choice) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or Starter/Standard) |

#### Step 3: Add Backend Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```
MONGO_URI = mongodb+srv://RGdebtRelief:Admin123@rgdebtrelief.qyjunw9.mongodb.net/invoicetest?retryWrites=true&w=majority&appName=invoicetest

PORT = 4000

NODE_ENV = production

JWT_SECRET = thisistheworldbestseriesofsuccess12345678910oftheworldofwonder

FRONTEND_URL = (Leave blank for now - will add after frontend deployment)
```

**⚠️ Important**: 
- Change `JWT_SECRET` to a strong random string (at least 32 characters)
- You can generate one at: https://randomkeygen.com/

#### Step 4: Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment to complete (3-5 minutes)
3. **Copy your backend URL**: `https://your-backend-name.onrender.com`

---

### **Part 2: Deploy Frontend (Static Site)**

#### Step 1: Create New Static Site
1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository (same repo)
3. Select the **recruitment-automation** repository

#### Step 2: Configure Frontend Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `recruitment-automation-frontend` (or your choice) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

#### Step 3: Add Frontend Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add this variable:

```
VITE_API_URL = https://your-backend-name.onrender.com
```

**Replace** `your-backend-name` with your actual backend URL from Part 1, Step 4

#### Step 4: Deploy Frontend
1. Click **"Create Static Site"**
2. Wait for deployment to complete (3-5 minutes)
3. **Copy your frontend URL**: `https://your-frontend-name.onrender.com`

---

### **Part 3: Update Backend CORS Configuration**

#### Step 1: Update Backend Environment Variable
1. Go to your **Backend Web Service** in Render Dashboard
2. Navigate to **"Environment"** tab
3. Find the `FRONTEND_URL` variable
4. Update its value to your frontend URL: `https://your-frontend-name.onrender.com`
5. Click **"Save Changes"**

#### Step 2: Redeploy Backend
- The backend will automatically redeploy with the new CORS settings
- Wait for redeployment to complete

---

## ✅ Verify Deployment

### Test Backend
Visit: `https://your-backend-name.onrender.com/api/health`

You should see:
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected"
}
```

### Test Frontend
1. Visit: `https://your-frontend-name.onrender.com`
2. You should see the Dashboard with data
3. Test navigation: Closures, Invoices, Cashflow, GST Report

---

## 🔄 Seed Data (Optional)

If you want to populate the database with demo data:

1. In Render Dashboard, go to your **Backend Web Service**
2. Click **"Shell"** tab (opens a terminal)
3. Run: `node seed-realworld.js`
4. Wait for completion message
5. Refresh your frontend to see the data

---

## 🎨 Custom Domain (Optional)

### For Frontend:
1. In your Static Site, go to **"Settings"** → **"Custom Domain"**
2. Click **"Add Custom Domain"**
3. Follow the instructions to configure DNS

### For Backend:
1. In your Web Service, go to **"Settings"** → **"Custom Domain"**
2. Click **"Add Custom Domain"**
3. Follow the instructions to configure DNS
4. **Remember to update** `VITE_API_URL` in frontend environment variables

---

## 🐛 Troubleshooting

### Backend won't start:
- Check **Logs** tab in Render Dashboard
- Verify `MONGO_URI` is correct
- Ensure all environment variables are set

### Frontend can't connect to backend:
- Check browser console for errors
- Verify `VITE_API_URL` points to correct backend URL
- Ensure `FRONTEND_URL` is set in backend environment variables
- Check backend logs for CORS errors

### Database connection error:
- Verify MongoDB Atlas IP whitelist (should be `0.0.0.0/0` for Render)
- Check `MONGO_URI` connection string is correct
- Ensure database user has proper permissions

### Free tier limitations:
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds to wake up
- Consider upgrading to Starter plan for always-on service

---

## 📊 Monitoring

### Backend Metrics:
- View in **Metrics** tab of your Web Service
- Monitor CPU, Memory, Response times

### Frontend Metrics:
- View in **Analytics** tab of your Static Site
- Monitor bandwidth and requests

---

## 🔐 Security Best Practices

1. **Change JWT Secret**: Use a strong random string (32+ characters)
2. **Environment Variables**: Never commit `.env` files to GitHub
3. **MongoDB**: Use strong password and enable IP whitelist
4. **HTTPS**: Render provides SSL certificates automatically
5. **API Keys**: Store sensitive keys in Render environment variables

---

## 📱 Your Deployment URLs

After deployment, save these URLs:

- **Frontend**: `https://your-frontend-name.onrender.com`
- **Backend**: `https://your-backend-name.onrender.com`
- **API Base**: `https://your-backend-name.onrender.com/api`

---

## 🎯 Developer Information

**Developed by**: Prince Kushwaha  
**Contact**: +91 9999631770  
**Email**: princekkushwaha@outlook.com

---

## 📞 Support

If you encounter issues:
1. Check Render logs (Dashboard → Your Service → Logs)
2. Review environment variables
3. Check MongoDB connection
4. Contact: princekkushwaha@outlook.com

---

## ✨ Success!

Your Recruitment Automation System is now live on Render! 🎉

Access your application at: `https://your-frontend-name.onrender.com`

---

**Last Updated**: October 26, 2025
