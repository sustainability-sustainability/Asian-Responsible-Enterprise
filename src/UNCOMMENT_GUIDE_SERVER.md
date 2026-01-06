# 📝 SERVER.JS UNCOMMENT GUIDE

This guide shows exactly what to uncomment in `/backend/server.js`

---

## 🎯 4 SECTIONS TO UNCOMMENT

### ✅ SECTION 1: Line 15 - MongoDB Import

**FIND THIS:**
```javascript
// MONGODB: Uncomment when ready to connect
// const mongoose = require('mongoose');
```

**CHANGE TO:**
```javascript
// MONGODB: Uncomment when ready to connect
const mongoose = require('mongoose');
```

**ACTION:** Delete `// ` from line 15

---

### ✅ SECTION 2: Lines 209-218 - MongoDB Connection

**FIND THIS:**
```javascript
// ========================================
// MONGODB CONNECTION
// ========================================
// MONGODB: Uncomment and add your MongoDB connection string
/*
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sdg-website';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));
*/
```

**CHANGE TO:**
```javascript
// ========================================
// MONGODB CONNECTION
// ========================================
// MONGODB: Uncomment and add your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sdg-website';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));
```

**ACTION:** Delete the `/*` on line 209 and `*/` on line 218

---

### ✅ SECTION 3: Lines 224-235 - Import Routes

**FIND THIS:**
```javascript
// ========================================
// IMPORT ROUTES
// ========================================
// MONGODB: Uncomment when you create the route files
/*
const homeRoutes = require('./routes/home');
const newsRoutes = require('./routes/news');
const eventsRoutes = require('./routes/events');
const publicationsRoutes = require('./routes/publications');
const awardsRoutes = require('./routes/awards');
const missionRoutes = require('./routes/mission');
const communityRoutes = require('./routes/community');
const contactRoutes = require('./routes/contact');
const themeRoutes = require('./routes/theme');
const authRoutes = require('./routes/auth');
*/
```

**CHANGE TO:**
```javascript
// ========================================
// IMPORT ROUTES
// ========================================
// MONGODB: Uncomment when you create the route files
const homeRoutes = require('./routes/home');
const newsRoutes = require('./routes/news');
const eventsRoutes = require('./routes/events');
const publicationsRoutes = require('./routes/publications');
const awardsRoutes = require('./routes/awards');
const missionRoutes = require('./routes/mission');
const communityRoutes = require('./routes/community');
const contactRoutes = require('./routes/contact');
const themeRoutes = require('./routes/theme');
const authRoutes = require('./routes/auth');
```

**ACTION:** Delete the `/*` on line 224 and `*/` on line 235

---

### ✅ SECTION 4: Lines 241-252 - Mount Routes

**FIND THIS:**
```javascript
// ========================================
// API ROUTES
// ========================================
// MONGODB: Uncomment when routes are ready
/*
app.use('/api/home', homeRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/awards', awardsRoutes);
app.use('/api/mission', missionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/auth', authRoutes);
*/
```

**CHANGE TO:**
```javascript
// ========================================
// API ROUTES
// ========================================
// MONGODB: Uncomment when routes are ready
app.use('/api/home', homeRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/awards', awardsRoutes);
app.use('/api/mission', missionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/auth', authRoutes);
```

**ACTION:** Delete the `/*` on line 241 and `*/` on line 252

---

## 🔧 QUICK REFERENCE

### Line Numbers to Edit:
- **Line 15** - Remove `// ` before `const mongoose`
- **Line 209** - Remove `/*`
- **Line 218** - Remove `*/`
- **Line 224** - Remove `/*`
- **Line 235** - Remove `*/`
- **Line 241** - Remove `/*`
- **Line 252** - Remove `*/`

### Total Changes: 7 edits

---

## ⚠️ OPTIONAL: Cloudinary File Upload

Lines 89-203 contain Cloudinary file upload code. This is **OPTIONAL** and only needed if you want to upload images/videos to the cloud.

For now, you can **LEAVE THIS COMMENTED OUT** and use it later if needed.

---

## ✅ AFTER UNCOMMENTING

Your server.js will:
1. ✅ Import mongoose
2. ✅ Connect to MongoDB
3. ✅ Import all route files
4. ✅ Mount all routes at `/api/*`
5. ✅ Be ready to handle frontend requests

---

## 🚀 TESTING

After uncommenting, test the server:

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on http://localhost:5000
```

If you see this, your backend is ready! 🎉
