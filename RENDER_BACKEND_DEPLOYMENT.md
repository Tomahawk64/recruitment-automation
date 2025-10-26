# 🚀 Deploy Backend to Render (Easiest HTTPS Solution)

## Why Render for Backend?

- ✅ **Automatic HTTPS** - No SSL setup needed
- ✅ **Free tier** - Good for testing
- ✅ **Auto-deploy** - Pushes to GitHub trigger deployments
- ✅ **Easy setup** - 10 minutes
- ✅ **No mixed content errors** - HTTPS everywhere

---

## Step-by-Step Guide

### Step 1: Go to Render Dashboard

Open: https://dashboard.render.com

### Step 2: Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**

### Step 3: Connect Repository

1. Find your **recruitment-automation** repository
2. Click **"Connect"**

### Step 4: Configure Service

Fill in these exact settings:

| Setting | Value |
|---------|-------|
| **Name** | `recruitment-automation-backend` |
| **Region** | Frankfurt (EU Central) or closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

### Step 5: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these **one by one**:

```env
MONGO_URI
mongodb+srv://RGdebtRelief:Admin123@rgdebtrelief.qyjunw9.mongodb.net/invoicetest?retryWrites=true&w=majority&appName=invoicetest

PORT
4000

NODE_ENV
production

JWT_SECRET
your-super-secure-random-secret-key-change-this-123456789

FRONTEND_URL
https://recruitment-automation-frontend.onrender.com
```

⚠️ **Change `JWT_SECRET` to a secure random string!**

Generate one: https://randomkeygen.com/

### Step 6: Create Web Service

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Watch the build logs

### Step 7: Copy Backend URL

After deployment succeeds, you'll see:

```
Your service is live at https://recruitment-automation-backend.onrender.com
```

**Copy this URL!** You'll need it for the next step.

---

## Step 8: Update Frontend Environment Variable

### In Render Dashboard:

1. Go to your **frontend** static site
2. Click **"Environment"** in left sidebar
3. Find `VITE_API_URL`
4. Click **Edit**
5. Change value to your new backend URL:
   ```
   https://recruitment-automation-backend.onrender.com
   ```
6. Click **"Save Changes"**

### Step 9: Redeploy Frontend

1. In your frontend static site
2. Click **"Manual Deploy"** button (top right)
3. Select **"Clear build cache & deploy"**
4. Wait 3-5 minutes

---

## Step 10: Update Local Configuration

Update your local `.env.example` files for documentation:

### frontend/.env.example
```bash
VITE_API_URL=https://recruitment-automation-backend.onrender.com
```

### backend/.env.example
```env
FRONTEND_URL=https://recruitment-automation-frontend.onrender.com
```

---

## Verification

### Test Backend
```powershell
Invoke-WebRequest -Uri "https://recruitment-automation-backend.onrender.com/health"
```

Expected response:
```json
{"status":"OK","timestamp":"2025-10-26T..."}
```

### Test Frontend

1. Open: https://recruitment-automation-frontend.onrender.com
2. Open Browser Console (F12)
3. Check Network tab
4. Should see HTTPS requests to backend
5. **No mixed content errors!** ✅

---

## Architecture After This Change

```
┌─────────────────────────────────────────────────────┐
│                    USERS                             │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────────────────┐
│  Frontend (Render Static Site)                      │
│  https://recruitment-automation-frontend.onrender.com│
└─────────────────┬───────────────────────────────────┘
                  │
                  │ HTTPS ✅ (No mixed content!)
                  ▼
┌─────────────────────────────────────────────────────┐
│  Backend (Render Web Service)                       │
│  https://recruitment-automation-backend.onrender.com │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ Encrypted Connection
                  ▼
┌─────────────────────────────────────────────────────┐
│  MongoDB Atlas (Cloud)                               │
│  mongodb+srv://...                                   │
└─────────────────────────────────────────────────────┘
```

---

## What About AWS Server?

You have two options:

### Option A: Keep AWS for Future Use
- Keep it running for other projects
- Use it for testing
- Keep it as a backup

### Option B: Stop AWS Instance (Save Money)
If you're only using Render:

1. Go to AWS Console → EC2
2. Select your instance
3. Click **Instance State** → **Stop**
4. This saves ~$8-10/month

You can start it again anytime if needed.

---

## Render Free Tier Limitations

⚠️ **Important to know:**

### Backend Web Service (Free Tier):
- ✅ HTTPS automatically
- ✅ 512 MB RAM
- ✅ Shared CPU
- ⚠️ **Spins down after 15 minutes of inactivity**
- ⚠️ First request after spin-down takes 30-60 seconds

### Frontend Static Site (Free Tier):
- ✅ HTTPS automatically
- ✅ CDN included
- ✅ 100 GB bandwidth/month
- ✅ **Always available** (doesn't spin down)
- ✅ Fast global delivery

### For Production:
Consider upgrading backend to **Starter plan ($7/month)**:
- No spin-down
- Always available
- More resources

---

## Troubleshooting

### Backend Build Failed

**Check logs in Render Dashboard**

Common issues:
- Missing dependencies → Check `package.json`
- Wrong Root Directory → Should be `backend`
- MongoDB connection → Check `MONGO_URI` env var

### Frontend Still Shows Mixed Content

**Make sure:**
1. Frontend `VITE_API_URL` points to HTTPS backend
2. You clicked "Clear build cache & deploy"
3. Wait for deployment to complete (green checkmark)
4. Hard refresh browser (Ctrl+Shift+R)

### CORS Errors

**Update backend `.env` on Render:**
1. Go to backend web service
2. Click "Environment"
3. Update `FRONTEND_URL` to match frontend URL exactly
4. Backend will auto-restart

---

## Comparison: AWS vs Render Backend

| Feature | AWS EC2 | Render |
|---------|---------|--------|
| **HTTPS** | Manual setup | Automatic ✅ |
| **Cost** | $8-10/month | Free (with limitations) |
| **Setup Time** | 30-60 minutes | 10 minutes ✅ |
| **Auto-deploy** | No | Yes ✅ |
| **Maintenance** | You manage | Render manages ✅ |
| **Always On** | Yes ✅ | Paid plans only |
| **Performance** | Dedicated | Shared (free) |

---

## Next Steps

1. ✅ Follow steps above to deploy backend on Render
2. ✅ Update frontend environment variable
3. ✅ Redeploy frontend
4. ✅ Test - No more mixed content errors!
5. ✅ (Optional) Stop AWS EC2 instance

---

## Final URLs

After completion:

| Service | URL | HTTPS |
|---------|-----|-------|
| **Frontend** | https://recruitment-automation-frontend.onrender.com | ✅ |
| **Backend** | https://recruitment-automation-backend.onrender.com | ✅ |
| **Database** | MongoDB Atlas | ✅ |

**Everything is HTTPS! No mixed content errors!** 🎉

---

**Time Required:** 15-20 minutes  
**Difficulty:** Easy  
**Recommended:** ✅ Yes, easiest solution

---

**Created:** October 26, 2025  
**Purpose:** Quick HTTPS setup for backend  
**Status:** Ready to deploy
