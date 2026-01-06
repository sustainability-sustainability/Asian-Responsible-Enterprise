# 🚀 How to Run Your SDG Website with Backend + CRUD

**NO CODING REQUIRED!** Everything is already built. Just follow these steps.

---

## ⚡ Quick Start (5 Steps - 10 Minutes)

### Step 1: Copy .env Files (1 min)

You edited `.env.example`, now create the actual files:

```bash
# Windows Command Prompt:
cd backend
copy .env.example .env
cd ..
copy .env.example .env

# Windows PowerShell:
cd backend
Copy-Item .env.example .env
cd ..
Copy-Item .env.example .env

# Mac/Linux:
cd backend
cp .env.example .env
cd ..
cp .env.example .env
```

---

### Step 2: Install Dependencies (3 min)

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install
```

---

### Step 3: Activate MongoDB (30 seconds)

This automatically enables CRUD operations:

```bash
node activate-mongodb.js
```

This script will:
- ✅ Enable all MongoDB code in backend
- ✅ Activate CRUD operations for all sections
- ✅ Create backups of original files
- ✅ Show you what was changed

---

### Step 4: Start Backend (30 seconds)

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully!
✅ Server running on http://localhost:5000
```

**Leave this terminal running!**

---

### Step 5: Start Frontend (30 seconds)

Open **NEW terminal** and run:

```bash
npm run dev
```

You should see:
```
Local: http://localhost:5173
```

**✅ Done! Your website is running!**

---

## 🎯 Test the CRUD Functionality

### 1. Open Website
```
http://localhost:5173
```

### 2. Access Admin Dashboard

**Option A: Bypass Mode (Testing)**
- Click the logo **5 times** quickly
- You'll see admin login
- Click "Use Bypass" button
- ✅ You're in the dashboard!

**Option B: Google OAuth (Production)**
- Configure Google OAuth in `.env`
- Click "Login with Google"

### 3. Test CRUD Operations

Once in the dashboard, try:

#### Create (Add):
1. Click "Home" tab
2. Click "Add Hero Section"
3. Fill in title, subtitle
4. Upload image
5. Click "Save"
6. ✅ New content added!

#### Read (View):
1. Go back to home page
2. ✅ See your new content!

#### Update (Edit):
1. Go back to dashboard
2. Click "Edit" on any item
3. Change the title
4. Click "Save"
5. ✅ Content updated!

#### Delete (Remove):
1. Click "Delete" on any item
2. Confirm deletion
3. ✅ Content removed!

---

## 🗄️ MongoDB Options

You have **2 choices**:

### Option A: MongoDB Atlas (Recommended - Free Cloud)

**Pros:** No installation, free, works everywhere, production-ready

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create free cluster (M0 Sandbox)
4. Get connection string
5. Add to `/backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sdg-website
   ```

**Setup time: 5 minutes**

---

### Option B: Local MongoDB (Advanced)

**Pros:** Complete control, no internet needed

#### Windows:
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB service
4. Use in `/backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/sdg-website
   ```

#### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux:
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Setup time: 15 minutes**

---

## 📋 Your .env Files Should Look Like This

### `/backend/.env` (Minimum Required):

```env
# Database - Choose one:

# Option A: MongoDB Atlas (Cloud - Recommended)
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster.mongodb.net/sdg-website

# Option B: Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/sdg-website

# Security (generate random string)
JWT_SECRET=your-super-secret-random-string-at-least-32-characters-long

# Server
PORT=5000
NODE_ENV=development

# CORS (allow frontend)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Optional - Cloudinary (skip for now)
# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=

# Optional - Google OAuth (skip for now, use bypass mode)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### `/.env` (Frontend):

```env
# Point to your backend
VITE_API_URL=http://localhost:5000/api

# Optional - Google OAuth
# VITE_GOOGLE_CLIENT_ID=
```

---

## 🔧 Generate Secure JWT_SECRET

Run this command to generate a secure random key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` in `/backend/.env`

---

## ✅ Troubleshooting

### Problem: "Cannot find module 'dotenv'"

**Solution:**
```bash
cd backend
npm install
```

### Problem: "MongoDB connection failed"

**Solutions:**
1. Check your `MONGODB_URI` in `/backend/.env`
2. If using Atlas, whitelist your IP: 0.0.0.0/0 (allows all)
3. If using local MongoDB, make sure it's running:
   ```bash
   # Windows: Check Services
   # Mac: brew services list
   # Linux: sudo systemctl status mongodb
   ```

### Problem: "Port 5000 already in use"

**Solution:**
```bash
# Change PORT in /backend/.env
PORT=5001
```

Then update frontend:
```bash
# Change in /.env
VITE_API_URL=http://localhost:5001/api
```

### Problem: "CORS error"

**Solution:**
Check `/backend/.env` has correct frontend URL:
```env
ALLOWED_ORIGINS=http://localhost:5173
```

### Problem: Backend shows "MongoDB not connected"

**Solution:**
Run the activation script:
```bash
node activate-mongodb.js
```

Then restart backend:
```bash
cd backend
npm run dev
```

---

## 🎯 What's Already Built (No Coding Needed!)

### ✅ Backend Features:
- 🔐 Authentication system (Google OAuth + Bypass)
- 📝 CRUD for all 8 sections
- 🖼️ File upload (images/videos)
- 🗄️ MongoDB integration
- 🔒 Security middleware
- 📊 50+ API endpoints

### ✅ Frontend Features:
- 🎨 8 complete sections (Home, Awards, Mission, etc.)
- 🎛️ Full admin dashboard
- ✏️ Content editors for everything
- 📤 File upload interface
- 🌓 Dark/light mode
- 📱 Responsive design
- ✨ Animations & effects

### ✅ CRUD Operations Built For:
1. Home (hero, stats, SDG highlights)
2. Awards (list, images, categories)
3. Mission (vision, approach, values)
4. News (articles, videos, featured)
5. Events (calendar, galleries, filtering)
6. Publications (books, PDFs, pagination)
7. Community (members, bios, links)
8. Contact (info, social, map)
9. Theme (colors, fonts, modes)
10. SEO (meta tags, descriptions)

**Everything is ready to use!**

---

## 📊 Testing Checklist

After running the project, test:

- [ ] Website loads at http://localhost:5173
- [ ] Backend running at http://localhost:5000
- [ ] Logo click 5x opens bypass login
- [ ] Dashboard loads after bypass
- [ ] Can add new content
- [ ] Can edit existing content
- [ ] Can delete content
- [ ] Changes appear on frontend
- [ ] Images upload successfully
- [ ] Dark/light mode works

---

## 🚀 Next Steps After Testing

### 1. Deploy to Production

Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md):
- Backend → Railway (free)
- Frontend → Vercel (free)
- Database → MongoDB Atlas (free)

### 2. Set Up Google OAuth

1. Go to https://console.cloud.google.com
2. Create project
3. Enable Google+ API
4. Create OAuth credentials
5. Add to `.env` files

### 3. Add Custom Domain

- Buy domain (Namecheap, GoDaddy)
- Point to Vercel
- Update CORS in backend

### 4. Add More Features

- Newsletter subscription
- Member registration
- Event ticketing
- Donation integration
- Blog section

---

## 📚 Documentation

- [START_HERE.md](./START_HERE.md) - Project overview
- [QUICK_START.md](./QUICK_START.md) - Quick reference
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Detailed development guide
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment
- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation
- [/backend/README.md](./backend/README.md) - Backend specific guide

---

## 💡 Pro Tips

### Tip 1: Keep Both Terminals Open
- Terminal 1: Backend (cd backend && npm run dev)
- Terminal 2: Frontend (npm run dev)

### Tip 2: Auto-Restart on Changes
Both servers auto-restart when you edit files!

### Tip 3: Check Backend Logs
Backend terminal shows all API calls and errors

### Tip 4: Use Browser DevTools
Press F12 to see network requests and errors

### Tip 5: MongoDB Compass
Download MongoDB Compass to visually browse your database

---

## 🎉 Summary

**To run your project with full CRUD:**

```bash
# 1. Copy .env files
cd backend && cp .env.example .env && cd .. && cp .env.example .env

# 2. Install dependencies
cd backend && npm install && cd .. && npm install

# 3. Activate MongoDB
node activate-mongodb.js

# 4. Start backend
cd backend && npm run dev

# 5. Start frontend (new terminal)
npm run dev

# 6. Open http://localhost:5173
# 7. Click logo 5x → Use Bypass
# 8. Test CRUD operations!
```

**Total time: 10 minutes**  
**Coding required: 0 lines** ✅

---

**Need help?** All the code is ready. Just follow the steps above!

**Questions?** Check the documentation files listed above.

**Ready to deploy?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**Your website is 100% complete and ready to run!** 🎉
