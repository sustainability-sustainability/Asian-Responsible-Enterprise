# ⚡ Quick Start Guide

Get your SDG website running in 5 minutes! Choose your path based on your needs.

---

## 🎯 Choose Your Setup

### 🟢 Path 1: Frontend Only (Fastest - 2 Minutes)

**Perfect for:**
- Testing the website
- Development and customization
- Showing to stakeholders
- Learning the system

**What you get:**
- ✅ Full website with all features
- ✅ Admin dashboard access
- ✅ All CRUD operations
- ✅ Data stored in browser (localStorage)

**Limitations:**
- ⚠️ Data only on this device
- ⚠️ Lost if browser cache cleared
- ⚠️ No multi-user access

**Setup:**

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Automatically opens at http://localhost:5173

# 4. Access admin (see Admin Access section below)
```

**That's it!** Your website is running! 🎉

---

### 🔵 Path 2: Full Stack (Production - 10 Minutes)

**Perfect for:**
- Production deployment
- Multiple administrators
- Permanent data storage
- Cross-device access

**What you get:**
- ✅ Everything from Path 1
- ✅ MongoDB database (persistent)
- ✅ Multi-device sync
- ✅ Backend API
- ✅ Production ready

**Setup:**

```bash
# 1. Install all dependencies
npm install
cd backend && npm install && cd ..

# 2. Set up backend environment
cd backend
cp .env.example .env

# 3. Edit .env file (required!)
# Open backend/.env and add:
#   MONGODB_URI=your-mongodb-connection-string
#   JWT_SECRET=your-super-secret-key
#   GOOGLE_CLIENT_ID=your-google-client-id (optional)
#   GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)

# 4. Get MongoDB connection string
# Option A: MongoDB Atlas (cloud - free tier)
#   - Go to https://www.mongodb.com/cloud/atlas
#   - Create account → Create cluster → Get connection string
#   - Replace <password> with your password
#
# Option B: Local MongoDB
#   - Install MongoDB locally
#   - Use: mongodb://localhost:27017/sdg-website

# 5. Start backend (terminal 1)
npm run dev

# 6. Start frontend (terminal 2 - new terminal)
cd ..
npm run dev
```

**Backend running at:** http://localhost:5000  
**Frontend running at:** http://localhost:5173

---

## 🔐 Admin Access

Once your site is running, access the admin dashboard:

### Step 1: Trigger Auth Modal
Click the **logo** (top left) **5 times quickly**

💡 **Tip:** Look for a subtle glow effect on the 5th click

### Step 2: Choose Authentication Method

#### Option A: Bypass (Development/Testing)
1. Hold `Ctrl+Shift+D` for **3 seconds**
2. A "Bypass Authentication" button appears
3. Click it
4. Access granted! 🎉

**When to use:**
- Development and testing
- Local environment
- No internet connection
- Quick content updates

#### Option B: Google OAuth (Production)
1. Click "Login with Google"
2. Authenticate with your Google account
3. Access granted! 🎉

**When to use:**
- Production environment
- Multiple administrators
- Audit trail needed
- Security important

**Setup required:** See [Google OAuth Setup](#google-oauth-setup) below

---

## 📝 First Steps in Dashboard

Once you're in the admin dashboard:

### 1. **Customize Theme**
- Go to **Theme** tab
- Choose colors: Gold, Blue, Green schemes
- Switch between Playful/Corporate design
- Set default dark/light mode

### 2. **Update Home Page**
- Go to **Home** tab
- Edit hero title and description
- Upload hero image
- Add SDG highlights

### 3. **Add Content**
- **News:** Add your first article
- **Events:** Create an event
- **Publications:** Add a book
- **Community:** Add team members

### 4. **Configure SEO**
- Go to **SEO** tab
- Set site title and description
- Add keywords
- Upload social media preview image

### 5. **Test Everything**
- Click "Back to Website" to see changes
- Check responsive design on mobile
- Toggle dark/light mode
- Test all navigation sections

---

## 🗂️ Data Storage Explained

### Frontend Only (Path 1)

```
Your Browser
└── localStorage
    ├── Home content
    ├── News articles
    ├── Events data
    ├── Images (base64)
    └── All other data
```

**Backup:** Export from dashboard or manually copy localStorage

### Full Stack (Path 2)

```
MongoDB Database (Cloud/Local)
├── homes collection
├── news collection
├── events collection
├── publications collection
├── images (base64 or Cloudinary URLs)
└── All other data
```

**Backup:** Automatic with MongoDB Atlas, or manual mongodump

---

## 🖼️ Uploading Images & Videos

### Small Files (< 5MB)
- Upload directly in dashboard
- Stored as base64 strings
- Works in both Path 1 and Path 2
- Instant upload and display

### Large Files (> 5MB) - Cloudinary Required
1. Create Cloudinary account (free): https://cloudinary.com
2. Get credentials from dashboard
3. Add to `backend/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
4. Restart backend
5. Large files now automatically use Cloudinary

**Videos:** Always use Cloudinary for best performance!

---

## 🎨 Customization Quick Tips

### Change Colors
```css
/* Edit /styles/globals.css */
--primary-gold: #fbbf24;      /* Your primary color */
--primary-blue: #3b82f6;      /* Action color */
--primary-green: #10b981;     /* Success color */
```

Or use **Dashboard → Theme** for easy changes!

### Change Fonts
```css
/* Edit /styles/globals.css */
--font-sans: 'Your Font', system-ui;
```

### Modify Layout
Edit component files in `/components/` folder

### Add New Section
1. Create component in `/components/YourSection.tsx`
2. Add to `navItems` in `/App.tsx`
3. Create dashboard editor in `/components/dashboard/DashboardYourSection.tsx`
4. Add backend route in `/backend/routes/yourSection.js`

---

## 🔧 Common Issues & Solutions

### Issue: Admin modal won't open
**Solution:** 
- Click logo exactly 5 times quickly (within 2 seconds)
- Look for console message: "Admin access activated"

### Issue: Bypass button doesn't appear
**Solution:**
- Hold `Ctrl+Shift+D` for full 3 seconds
- Don't release early
- Look for console message

### Issue: Changes not saving
**Solution:**
- Check browser console for errors (F12)
- Ensure localStorage is enabled in browser settings
- If using backend, check backend is running

### Issue: Backend won't start
**Solution:**
```bash
# Check if .env file exists
ls backend/.env

# If not, create it:
cp backend/.env.example backend/.env

# Edit with your values
nano backend/.env  # or use any text editor
```

### Issue: MongoDB connection failed
**Solution:**
- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)
- Ensure MongoDB cluster is running
- Test connection:
  ```bash
  cd backend
  node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
  ```

### Issue: Port already in use
**Solution:**
```bash
# Frontend (5173)
lsof -ti:5173 | xargs kill -9

# Backend (5000)
lsof -ti:5000 | xargs kill -9

# Or change ports in vite.config.ts and backend/server.js
```

### Issue: Images not loading
**Solution:**
- Check file size (< 5MB without Cloudinary)
- Check browser console for errors
- Verify image format (jpg, png, gif, webp)
- Try a different browser

---

## 🚀 Next Steps

After getting started:

### Day 1
- [ ] Access admin dashboard
- [ ] Customize theme colors
- [ ] Add real content to all sections
- [ ] Upload your images
- [ ] Test on mobile devices

### Week 1
- [ ] Complete all content sections
- [ ] Configure SEO settings
- [ ] Test all features thoroughly
- [ ] Show to stakeholders for feedback
- [ ] Plan content calendar

### Month 1
- [ ] Set up MongoDB for production
- [ ] Configure Cloudinary for media
- [ ] Deploy to production (see DEPLOYMENT_GUIDE.md)
- [ ] Set up custom domain
- [ ] Launch! 🎉

---

## 📚 Learn More

### Documentation
- **Development Guide** - Learn the codebase and add features
- **Deployment Guide** - Deploy to production
- **API Reference** - Backend API documentation

### Code Examples

**Fetch data from API:**
```typescript
import { api } from './utils/api';

const news = await api.news.getAll();
```

**Upload image:**
```typescript
const formData = new FormData();
formData.append('file', file);
const result = await api.upload(formData);
```

**Update content:**
```typescript
await api.news.update(id, {
  title: 'New Title',
  content: 'New content...'
});
```

---

## 🎓 Learning Resources

### React & TypeScript
- React Docs: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs

### Styling
- Tailwind CSS: https://tailwindcss.com
- Motion (Framer Motion): https://motion.dev

### Backend
- Express.js: https://expressjs.com
- MongoDB: https://www.mongodb.com/docs
- Mongoose: https://mongoosejs.com

### Deployment
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- MongoDB Atlas: https://www.mongodb.com/docs/atlas

---

## 🔐 Google OAuth Setup

If you want to use Google OAuth instead of bypass:

### 1. Create Google Cloud Project
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Google+ API

### 2. Create OAuth Credentials
1. Go to "Credentials"
2. Create OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://your-domain.com/api/auth/google/callback`

### 3. Add to Environment
```env
# backend/.env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

### 4. Test
1. Restart backend
2. Click logo 5 times
3. Click "Login with Google"
4. Authenticate
5. Success! 🎉

---

## 🎉 You're Ready!

You now have:
- ✅ Website running locally
- ✅ Admin access configured
- ✅ Understanding of the system
- ✅ Path forward for production

**Start customizing and make it yours!** 🌟

Need help? Check the other documentation files or look at code comments.

---

**Pro Tips:**
- Use browser DevTools (F12) to debug issues
- Check console for helpful hints about admin access
- Save your work frequently (it auto-saves in dashboard)
- Test on multiple browsers and devices
- Keep your `.env` file secret and secure

---

**Happy building!** 🚀🌍

Last Updated: December 14, 2024
