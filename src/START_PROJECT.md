# 🎯 START PROJECT - Quick Commands

## 🚀 First Time Setup

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ..
npm install
```

## ▶️ Running the Project

### Terminal 1 - Start Backend (Required)
```bash
cd backend
npm start
```

**Expected Output:**
```
========================================
🚀 SDG WEBSITE BACKEND SERVER
========================================
📡 Server is running on port 5000
📍 Health check: http://localhost:5000/api/health
🌍 Environment: production
🔒 CORS Allowed Origins: http://localhost:3000, http://localhost:5173

========================================
🔐 SECURITY STATUS
========================================
✅ Security headers enabled
✅ Rate limiting enabled
✅ Request sanitization enabled

========================================
💾 DATABASE STATUS
========================================
✅ MongoDB ACTIVE
📝 Connection: mongodb+srv://sharonmyoi19:****@asian.vwrnzae.mongodb.net/...

========================================
📦 FILE UPLOAD STATUS
========================================
✅ Cloudinary configured
========================================

✅ MongoDB Connected Successfully
```

### Terminal 2 - Start Frontend
```bash
npm run dev
```

**Expected Output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## ✅ Verify Everything Works

1. **Backend Health Check:**
   Open browser: `http://localhost:5000/api/health`
   
   Should show:
   ```json
   {
     "status": "ok",
     "message": "Server is running",
     "mongodb": "connected"
   }
   ```

2. **Frontend:**
   Open browser: `http://localhost:5173`
   
   You should see the website loading.

3. **Dashboard:**
   Navigate to the dashboard (click login)
   - Email: any@email.com
   - Password: anything
   - (Bypass mode is enabled for development)

## 🎨 What's Working Now

✅ **Awards Section**
- Add awards with images
- Upload to Cloudinary
- Real-time updates
- No dummy data

✅ **Mission Section**
- Edit hero title/subtitle
- Manage pillars
- Manage objectives
- Persists to MongoDB

✅ **News Section**
- Add articles
- Add featured videos
- Separate collections for better organization

✅ **All Other Sections**
- Home
- Events
- Publications
- Community
- Contact

## 🔥 Common Commands

### Restart Backend:
```bash
cd backend
npm start
```

### Restart Frontend:
```bash
npm run dev
```

### Check Backend Logs:
Look at Terminal 1 where backend is running

### Check Frontend Logs:
Look at Terminal 2 where frontend is running

### Check Browser Console:
F12 → Console tab

## ⚠️ Troubleshooting

### Port Already in Use

**Backend (5000):**
```bash
# Find process
lsof -ti:5000

# Kill process
kill -9 $(lsof -ti:5000)

# Restart backend
cd backend && npm start
```

**Frontend (5173):**
```bash
# Find process
lsof -ti:5173

# Kill process
kill -9 $(lsof -ti:5173)

# Restart frontend
npm run dev
```

### MongoDB Connection Failed

1. Check internet connection
2. Verify MongoDB Atlas IP whitelist
3. Confirm credentials in `/backend/.env`
4. Check MongoDB Atlas dashboard

### Cloudinary Upload Failing

1. Verify credentials in `/backend/.env`
2. Check Cloudinary dashboard for API limits
3. Ensure correct cloud name

### Cannot See Data

1. Make sure backend is running
2. Check backend console for errors
3. Open browser DevTools → Network tab
4. Look for failed API calls

## 📊 Development Workflow

1. Start backend (Terminal 1)
2. Start frontend (Terminal 2)
3. Open `http://localhost:5173`
4. Login to dashboard
5. Add content (will save to MongoDB)
6. View changes on website immediately

## 🎯 Quick Test

1. **Add an Award:**
   - Dashboard → Awards → Add Award
   - Fill in details
   - Upload image
   - Save
   - Check website Awards page

2. **Edit Mission:**
   - Dashboard → Mission → Edit Hero Section
   - Change text
   - Save
   - Check website Mission page

3. **Add News Article:**
   - Dashboard → News → Add Article
   - Fill in details
   - Save
   - Check website News page

## 💾 Your Data is Safe

Everything you enter through the dashboard is:
- ✅ Saved to MongoDB
- ✅ Persistent across restarts
- ✅ Backed up by MongoDB Atlas
- ✅ No dummy data interfering

## 🎉 You're Ready!

Both servers running? Data saving? Images uploading?

**You're all set to build your SDG website! 🚀**

---

## 📞 Quick Reference

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health
- **MongoDB:** Check Atlas Dashboard
- **Cloudinary:** Check Cloudinary Dashboard

## 🔐 Production Notes

When ready for production:
1. Set `ENABLE_BYPASS_LOGIN=false` in backend/.env
2. Update `CORS_ORIGIN` with production domain
3. Update frontend API_BASE_URL
4. Deploy backend to cloud (Heroku, Railway, etc.)
5. Deploy frontend to Vercel/Netlify
6. Update environment variables on hosting platforms
