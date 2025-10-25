# 🎬 Render Deployment - Manual Step-by-Step Guide

## Before You Start

### ✅ Pre-Deployment Checklist

- [ ] GitHub account created
- [ ] Render account created (render.com)
- [ ] Project pushed to GitHub (main branch)
- [ ] MongoDB Atlas connection string ready
- [ ] JWT secret generated (use: https://randomkeygen.com/)

---

## 🔧 Part 1: Backend Deployment (15 minutes)

### Step 1: Access Render Dashboard

1. Open browser and go to: https://dashboard.render.com
2. Log in with your account
3. You'll see the main dashboard

### Step 2: Create Backend Web Service

1. Click the **"New +"** button (top right)
2. Select **"Web Service"** from dropdown
3. Click **"Connect account"** if this is your first time
4. Authorize Render to access your GitHub repositories
5. Find and select your **recruitment-automation** repository
6. Click **"Connect"**

### Step 3: Configure Backend Settings

You'll see a form with many fields. Fill them carefully:

#### Basic Settings:
```
Name: recruitment-automation-backend
(or any name you prefer - this will be in your URL)

Region: Select the one closest to you
- Oregon (US West)
- Ohio (US East)
- Frankfurt (Europe)
- Singapore (Asia)

Branch: main
(the branch Render will deploy from)
```

#### Build & Deploy Settings:
```
Root Directory: backend
(tells Render your backend code is in the "backend" folder)

Runtime: Node
(Render auto-detects this, just verify it's "Node")

Build Command: npm install
(installs all dependencies)

Start Command: npm start
(runs your server)
```

#### Instance Type:
```
Select: Free
(or choose Starter $7/month for better performance)
```

### Step 4: Add Environment Variables

1. Scroll down to **"Environment Variables"** section
2. Click **"Add Environment Variable"** button
3. Add these one by one:

**Variable 1:**
```
Key: MONGO_URI
Value: mongodb+srv://RGdebtRelief:Admin123@rgdebtrelief.qyjunw9.mongodb.net/invoicetest?retryWrites=true&w=majority&appName=invoicetest
```

**Variable 2:**
```
Key: PORT
Value: 4000
```

**Variable 3:**
```
Key: NODE_ENV
Value: production
```

**Variable 4:**
```
Key: JWT_SECRET
Value: [Generate at https://randomkeygen.com/ - copy the "Fort Knox Password"]
Example: Kj8#mP2$vN9@rT4&xL7!wQ1%zF5*bH3^
```

**Variable 5:**
```
Key: FRONTEND_URL
Value: (leave blank for now - we'll add this after frontend deployment)
```

### Step 5: Deploy Backend

1. Double-check all settings
2. Click **"Create Web Service"** button (bottom of page)
3. Render will start deploying (this takes 3-5 minutes)
4. You'll see logs scrolling in real-time
5. Wait for: **"✓ Build successful"** and **"✓ Live"**

### Step 6: Get Your Backend URL

1. At the top of the page, you'll see your service URL
2. It looks like: `https://recruitment-automation-backend.onrender.com`
3. **COPY THIS URL** - you'll need it for frontend!
4. Test it: Open `https://your-backend-url.onrender.com/api/health`
5. You should see: `{"status":"ok","message":"Server is running"}`

📝 **Write down your backend URL here:**
```
Backend URL: https://________________________.onrender.com
```

---

## 🎨 Part 2: Frontend Deployment (15 minutes)

### Step 1: Create Frontend Static Site

1. Go back to Render Dashboard: https://dashboard.render.com
2. Click **"New +"** button again
3. This time select **"Static Site"**
4. Connect to the **same GitHub repository** (recruitment-automation)
5. Click **"Connect"**

### Step 2: Configure Frontend Settings

Fill in the form:

#### Basic Settings:
```
Name: recruitment-automation-frontend
(or any name you prefer)

Region: Same as backend
(choose the same region you selected for backend)

Branch: main
```

#### Build & Deploy Settings:
```
Root Directory: frontend
(tells Render your frontend code is in the "frontend" folder)

Build Command: npm install && npm run build
(installs dependencies and builds production files)

Publish Directory: dist
(Vite outputs built files to "dist" folder)
```

### Step 3: Add Frontend Environment Variable

1. Scroll to **"Environment Variables"**
2. Click **"Add Environment Variable"**
3. Add this variable:

```
Key: VITE_API_URL
Value: [YOUR BACKEND URL FROM PART 1]
Example: https://recruitment-automation-backend.onrender.com
```

⚠️ **Important**: 
- Copy your backend URL EXACTLY
- Do NOT add `/api` at the end
- Do NOT add a trailing slash `/`

### Step 4: Deploy Frontend

1. Review all settings
2. Click **"Create Static Site"** button
3. Wait for deployment (3-5 minutes)
4. Watch the build logs
5. Wait for: **"✓ Site is live"**

### Step 5: Get Your Frontend URL

1. At the top of the page, you'll see your site URL
2. It looks like: `https://recruitment-automation-frontend.onrender.com`
3. **COPY THIS URL** - you need it for the final step!

📝 **Write down your frontend URL here:**
```
Frontend URL: https://________________________.onrender.com
```

---

## 🔗 Part 3: Connect Backend & Frontend (5 minutes)

### Step 1: Update Backend CORS Configuration

1. Go back to Render Dashboard
2. Find your **Backend Web Service** (recruitment-automation-backend)
3. Click on it to open
4. Click on **"Environment"** tab (left sidebar)
5. Find the `FRONTEND_URL` variable (it's blank)
6. Click the **"Edit"** button (pencil icon)
7. Enter your frontend URL:
   ```
   https://your-frontend-name.onrender.com
   ```
8. Click **"Save Changes"**

### Step 2: Wait for Redeployment

1. Backend will automatically redeploy (2-3 minutes)
2. Wait for **"✓ Deploy live"** message
3. Your backend now accepts requests from your frontend!

---

## ✅ Part 4: Verify Everything Works (5 minutes)

### Test 1: Backend Health Check

1. Open: `https://your-backend.onrender.com/api/health`
2. Expected response:
   ```json
   {
     "status": "ok",
     "message": "Server is running",
     "database": "connected"
   }
   ```
3. ✅ If you see this, backend is working!
4. ❌ If you see error, check Logs tab in backend dashboard

### Test 2: Frontend Loading

1. Open: `https://your-frontend.onrender.com`
2. You should see the Dashboard page
3. Check for:
   - ✅ No errors in browser console (Press F12)
   - ✅ Data loading (charts, metrics)
   - ✅ Developer card in sidebar (Prince Kushwaha)

### Test 3: Navigation

Click through each page:
- ✅ Dashboard (charts and metrics visible)
- ✅ Closures (table with data)
- ✅ Invoices (invoice list)
- ✅ Cashflow (payment timeline cards)
- ✅ GST Report (tax breakdown)

### Test 4: Full Feature Test

1. Go to Closures page
2. Click "Add Closure" button
3. Fill in form and submit
4. ✅ New closure appears in table
5. Click "Generate Invoice" for a closure
6. ✅ Invoice appears in Invoices page

---

## 🎲 Optional: Seed Demo Data

If you want 30 closures and 30 invoices with realistic data:

### Method 1: Using Render Shell (Recommended)

1. Go to your Backend Web Service in Render
2. Click **"Shell"** tab (left sidebar)
3. A terminal opens in your browser
4. Type: `node seed-realworld.js`
5. Press Enter
6. Wait for: "✓ Successfully seeded 30 closures and 30 invoices"
7. Go to frontend and refresh - data appears!

### Method 2: Using API Endpoint

1. Open: `https://your-backend.onrender.com/api/seed`
2. Data will be seeded automatically
3. Refresh frontend to see data

---

## 🚨 Troubleshooting Guide

### Problem: Backend Logs Show "MongoDB Connection Error"

**Solution:**
1. Go to MongoDB Atlas (cloud.mongodb.com)
2. Click "Network Access" (left menu)
3. Click "Add IP Address"
4. Click "Allow Access From Anywhere"
5. Enter: `0.0.0.0/0`
6. Click "Confirm"
7. Wait 2 minutes, then redeploy backend

### Problem: Frontend Shows Blank White Page

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Common issue: `VITE_API_URL` is wrong
4. Go to Frontend → Environment
5. Verify `VITE_API_URL` matches your backend URL exactly
6. Save and redeploy

### Problem: "CORS Error" in Browser Console

**Solution:**
1. Go to Backend → Environment
2. Check `FRONTEND_URL` variable
3. Must match your frontend URL exactly
4. No trailing slash
5. Example: `https://your-app.onrender.com` ✅
6. Wrong: `https://your-app.onrender.com/` ❌
7. Save and redeploy backend

### Problem: "Network Error" When Clicking Buttons

**Solution:**
1. Check backend is running (visit health endpoint)
2. If backend is sleeping (free tier):
   - Wait 30-60 seconds for it to wake up
   - Try again
3. Check browser console for specific error
4. Verify `VITE_API_URL` in frontend environment

### Problem: Data Not Loading

**Solution:**
1. Backend might be empty - seed data first
2. Use Shell method above to run seed script
3. Or add closures manually via "Add Closure" button
4. Check backend logs for database errors

---

## 📊 Monitoring Your Application

### Backend Monitoring

1. Click on your Backend service
2. Tabs available:
   - **Logs**: Real-time server logs
   - **Metrics**: CPU, Memory, Response times
   - **Events**: Deployment history
   - **Environment**: Manage variables

### Frontend Monitoring

1. Click on your Static Site
2. Tabs available:
   - **Deploys**: Build history
   - **Headers**: Custom headers
   - **Redirects**: URL redirects

---

## 💰 Free Tier Limitations

**Render Free Tier:**
- ✅ Free forever
- ✅ 750 hours/month (enough for 1 service)
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Takes 30-60 seconds to wake up on first request
- ⚠️ 100 GB bandwidth/month

**Tips for Free Tier:**
- First request might be slow (waking up)
- Set up a free uptime monitor (uptimerobot.com) to keep it alive
- Or upgrade to Starter plan ($7/month) for always-on

---

## 🎓 What You Just Did!

Congratulations! You've successfully:

✅ Deployed a production-ready MERN stack application
✅ Configured separate backend and frontend services
✅ Set up environment variables securely
✅ Connected MongoDB Atlas database
✅ Enabled CORS for secure communication
✅ Made your app accessible worldwide via HTTPS

**Your live application:**
- Frontend: `https://your-frontend.onrender.com`
- Backend: `https://your-backend.onrender.com/api`

---

## 📞 Need Help?

**Developer Contact:**
- **Name**: Prince Kushwaha
- **Mobile**: +91 9999631770
- **Email**: princekkushwaha@outlook.com

**When contacting:**
- Screenshot the error from browser console (F12)
- Share your Render logs (copy from Logs tab)
- Mention which step you're stuck on

---

## 🎉 Success Checklist

Mark these off as you complete:

- [ ] Backend deployed and showing "Live"
- [ ] Frontend deployed and showing "Live"
- [ ] Health endpoint returns 200 OK
- [ ] Frontend loads without errors
- [ ] Can navigate all pages
- [ ] Data displays correctly
- [ ] Can add new closures
- [ ] Can generate invoices
- [ ] Developer card visible in sidebar

**All checked?** 🎊 **YOU'RE DONE! Your app is live!**

Share your frontend URL with others and show off your work! 🚀

---

**Last Updated:** October 26, 2025  
**Version:** 1.0 - Production Ready
