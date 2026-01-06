# 🚀 SDG Website - Complete Setup Instructions

## ✅ What's Been Fixed

1. **MongoDB Fully Activated** - All backend connections are now active
2. **Awards Image Upload Added** - You can now upload images for awards
3. **Mission Dashboard Fixed** - Mission not defined error resolved
4. **News Model Fixed** - CastError resolved by separating Articles and Videos
5. **All Dummy Data Removed** - Clean slate for your actual data
6. **Cloudinary Integration** - Image and video uploads are ready

## 📋 Quick Start Guide

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (if not done)
cd ..
npm install
```

### 2. Environment Variables

Your `.env` file is already configured with:
- ✅ MongoDB Connection
- ✅ JWT Secret
- ✅ Cloudinary Credentials
- ✅ Google OAuth

Make sure the `/backend/.env` file exists with the same content.

### 3. Start the Backend Server

```bash
cd backend
node server.js
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 SDG WEBSITE BACKEND SERVER
📡 Server is running on port 5000
```

### 4. Start the Frontend

```bash
# In the root directory
npm run dev
```

## 🗄️ Database Setup

### Option 1: Start Fresh
Your database is empty. Just start using the dashboard to add content!

### Option 2: Seed Default Data
If you want to pre-populate with sample data, you can manually add some entries through the dashboard.

## 🎯 Using the Dashboard

1. **Login** - Use any email/password (bypass mode is enabled in development)
2. **Navigate to each section:**
   - **Home** - Edit hero section and features
   - **Awards** - Add awards WITH images now!
   - **Mission** - Edit mission pillars and objectives
   - **News** - Add articles and videos
   - **Events** - Manage events
   - **Publications** - Add publications
   - **Community** - Manage community content
   - **Contact** - Update contact information

## 📸 Uploading Images

### For Awards:
1. Go to Dashboard → Awards
2. Click "Add Award" or edit existing
3. You'll see a new "Image (optional)" field
4. Upload image through Cloudinary
5. Save!

### For Other Sections:
Use the `FileUpload` component that's already integrated.

## ⚠️ Common Issues & Solutions

### Issue: "MongoDB not connected"
**Solution:** 
- Check if MongoDB URI is correct in `.env`
- Make sure your IP is whitelisted in MongoDB Atlas
- Restart the backend server

### Issue: "Cannot POST /api/..."
**Solution:**
- Make sure backend server is running on port 5000
- Check `utils/api.ts` - API_BASE_URL should be `http://localhost:5000`

### Issue: "Image upload failing"
**Solution:**
- Verify Cloudinary credentials in `.env`
- Check cloud name, API key, and API secret are correct

### Issue: "Empty arrays in database"
**Solution:**
- This is normal for a fresh database
- Simply add content through the dashboard
- Data will persist in MongoDB

## 🔍 Verifying Everything Works

### Check Backend Health:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Server is running",
  "mongodb": "connected"
}
```

### Check MongoDB Connection:
Look at the backend console. You should see:
```
✅ MongoDB Connected Successfully
```

### Check Frontend API Connection:
Open browser console on any dashboard page. You should NOT see:
- "MongoDB not connected" messages
- Empty array warnings
- Connection errors

## 📊 Data Structure

### Awards:
```javascript
{
  title: String,
  organization: String,
  category: String,
  year: String,
  description: String,
  sdg: Number (1-17),
  color: String (Tailwind gradient),
  image: String (Cloudinary URL) // NEW!
}
```

### Mission:
```javascript
{
  content: {
    heroTitle: String,
    heroSubtitle: String,
    pillars: [{ title, description, color }],
    objectives: [{ title, description, color }]
  }
}
```

### News Articles:
```javascript
{
  title: String,
  excerpt: String,
  content: String,
  author: String,
  date: String,
  image: String,
  category: String,
  tags: [String],
  sdg: Number
}
```

## 🎨 Design Stays the Same

All the beautiful design, animations, and styling remain unchanged. Only:
- ✅ Backend is now connected
- ✅ Data comes from MongoDB
- ✅ No more dummy/default data
- ✅ Everything is editable through dashboard

## 🚦 Testing Checklist

- [ ] Backend starts without errors
- [ ] MongoDB shows "connected"
- [ ] Can login to dashboard
- [ ] Can add a new award WITH image
- [ ] Can edit mission content
- [ ] Can add news articles
- [ ] Can add events
- [ ] Website displays actual data from database
- [ ] No console errors
- [ ] Image upload works

## 🆘 Need Help?

1. Check backend console for errors
2. Check browser console for frontend errors
3. Verify MongoDB connection string
4. Verify Cloudinary credentials
5. Make sure both frontend and backend are running

## 📝 Production Deployment Notes

Before deploying to production:

1. **Disable Bypass Login:**
   - Set `ENABLE_BYPASS_LOGIN=false` in `.env`
   - Configure proper Google OAuth

2. **Update CORS:**
   - Add production domain to `CORS_ORIGIN` in `.env`

3. **Environment Variables:**
   - Set `NODE_ENV=production`
   - Use production MongoDB cluster
   - Update API_BASE_URL in frontend

4. **Security:**
   - Rate limiting is already enabled
   - Security headers are configured
   - Request sanitization is active

## 🎉 You're All Set!

Your website is now fully connected to MongoDB with:
- Real-time data updates
- Image upload capability  
- No dummy data
- Complete CRUD operations
- Beautiful design preserved

Happy building! 🚀
