# 🌱 How to Seed Your MongoDB Database

## 📋 Overview

This guide shows you how to populate your MongoDB database with initial data that has **valid ObjectIds**.

---

## 🎯 Option 1: Use the Admin Dashboard (Recommended)

Once MongoDB is connected, use your admin panel to create data through the UI:

1. **Login to Admin Panel:**
   - Go to `http://localhost:5173/admin-secret-login-bypass-mode`
   - Login with Google OAuth

2. **Create Data Through UI:**
   - Click on each section (Awards, News, Events, Publications)
   - Click "Add New" button
   - Fill in the form
   - Click "Save"

✅ **MongoDB will automatically generate valid ObjectIds!**

---

## 🎯 Option 2: Create a Seed Script

Create a script to populate your database with initial data.

### Step 1: Create Seed File

Create `/backend/scripts/seed.js`:

```javascript
// ========================================
// DATABASE SEED SCRIPT
// ========================================
// Run with: node backend/scripts/seed.js

require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Award = require('../models/Award');
const Event = require('../models/Event');
const Publication = require('../models/Publication');
const News = require('../models/News');
const Community = require('../models/Community');
const Mission = require('../models/Mission');
const Contact = require('../models/Contact');
const Home = require('../models/Home');
const Theme = require('../models/Theme');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sdg-website';

// Sample data
const sampleAwards = [
  {
    title: 'Best SDG Implementation 2024',
    organization: 'Green Future Corp',
    year: 2024,
    category: 'Environmental Excellence',
    description: 'Outstanding contribution to SDG 13: Climate Action',
    image: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800',
    sdgs: [13],
    order: 1
  },
  {
    title: 'Social Innovation Award 2024',
    organization: 'Hope Foundation',
    year: 2024,
    category: 'Social Impact',
    description: 'Exceptional work in SDG 1: No Poverty',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
    sdgs: [1],
    order: 2
  },
  {
    title: 'Education Excellence 2023',
    organization: 'Learn Together Initiative',
    year: 2023,
    category: 'Education',
    description: 'Transforming education through SDG 4: Quality Education',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    sdgs: [4],
    order: 3
  }
];

const sampleEvents = [
  {
    title: 'SDG Summit 2024',
    description: 'Annual gathering of sustainability leaders',
    month: 'March',
    year: 2024,
    location: 'Bangkok, Thailand',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'
    ],
    sdgs: [17]
  },
  {
    title: 'Green Innovation Workshop',
    description: 'Hands-on workshop for sustainable business practices',
    month: 'June',
    year: 2024,
    location: 'Singapore',
    coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800'
    ],
    sdgs: [12, 13]
  }
];

const samplePublications = [
  {
    title: 'Sustainable Business Practices 2024',
    author: 'Asian Responsible Enterprise',
    year: 2024,
    description: 'Comprehensive guide to implementing SDGs in business',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800',
    downloadUrl: '#',
    sdgs: [8, 9, 12],
    order: 1
  },
  {
    title: 'Climate Action Report',
    author: 'ARE Research Team',
    year: 2024,
    description: 'Annual report on climate change initiatives',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
    downloadUrl: '#',
    sdgs: [13],
    order: 2
  }
];

// Seed function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data (OPTIONAL - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await Award.deleteMany({});
    await Event.deleteMany({});
    await Publication.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Seed Awards
    console.log('📊 Seeding Awards...');
    const awards = await Award.insertMany(sampleAwards);
    console.log(`✅ Created ${awards.length} awards`);
    console.log('   Sample Award ID:', awards[0]._id.toString(), '\n');

    // Seed Events
    console.log('📅 Seeding Events...');
    const events = await Event.insertMany(sampleEvents);
    console.log(`✅ Created ${events.length} events`);
    console.log('   Sample Event ID:', events[0]._id.toString(), '\n');

    // Seed Publications
    console.log('📚 Seeding Publications...');
    const publications = await Publication.insertMany(samplePublications);
    console.log(`✅ Created ${publications.length} publications`);
    console.log('   Sample Publication ID:', publications[0]._id.toString(), '\n');

    // Seed News (if doesn't exist)
    console.log('📰 Checking News...');
    let news = await News.findOne();
    if (!news) {
      news = new News({
        articles: [
          {
            title: 'New Sustainability Initiative Launched',
            excerpt: 'Exciting new program to accelerate SDG implementation',
            content: 'Full article content here...',
            image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
            date: new Date(),
            author: 'ARE Team',
            category: 'News',
            sdgs: [17]
          }
        ],
        featuredVideos: []
      });
      await news.save();
      console.log('✅ Created News section\n');
    } else {
      console.log('✅ News section already exists\n');
    }

    // Seed Home (if doesn't exist)
    console.log('🏠 Checking Home...');
    let home = await Home.findOne();
    if (!home) {
      home = new Home({
        heroTitle: 'Building a Sustainable Future',
        heroSubtitle: 'Together we achieve the 17 Sustainable Development Goals',
        heroImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920',
        featuredSDGs: [1, 3, 4, 5, 8, 13, 17],
        aboutText: 'Asian Responsible Enterprise is committed to promoting sustainability...'
      });
      await home.save();
      console.log('✅ Created Home section\n');
    } else {
      console.log('✅ Home section already exists\n');
    }

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📝 Summary:');
    console.log(`   - ${awards.length} Awards`);
    console.log(`   - ${events.length} Events`);
    console.log(`   - ${publications.length} Publications`);
    console.log('   - News section ready');
    console.log('   - Home section ready\n');

    console.log('💡 You can now use these ObjectIds in your frontend!');
    console.log('   Example Award ID:', awards[0]._id.toString());

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Disconnect
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run seed
seedDatabase();
```

### Step 2: Run the Seed Script

```bash
cd backend
node scripts/seed.js
```

### Expected Output:

```
🌱 Starting database seed...
✅ Connected to MongoDB

🗑️  Clearing existing data...
✅ Existing data cleared

📊 Seeding Awards...
✅ Created 3 awards
   Sample Award ID: 507f1f77bcf86cd799439011

📅 Seeding Events...
✅ Created 2 events
   Sample Event ID: 6751a2b3c4d5e6f7a8b9c0d1

📚 Seeding Publications...
✅ Created 2 publications
   Sample Publication ID: 7862b3c4d5e6f7a8b9c0d1e2

🎉 Database seeding completed successfully!

📝 Summary:
   - 3 Awards
   - 2 Events
   - 2 Publications
   - News section ready
   - Home section ready

💡 You can now use these ObjectIds in your frontend!
   Example Award ID: 507f1f77bcf86cd799439011

👋 Disconnected from MongoDB
```

---

## 🎯 Option 3: Use MongoDB Compass (GUI)

1. **Download MongoDB Compass:** https://www.mongodb.com/products/compass

2. **Connect to your database:**
   - Connection String: `mongodb://localhost:27017/sdg-website`

3. **Create documents manually:**
   - Select a collection (e.g., `awards`)
   - Click "Add Data" → "Insert Document"
   - MongoDB Compass will auto-generate ObjectIds

---

## 🎯 Option 4: Use Postman/API Calls

Once your backend is running, use the API to create data:

### Create an Award:
```bash
curl -X POST http://localhost:5000/api/awards \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Excellence Award 2024",
    "organization": "Green Corp",
    "year": 2024,
    "category": "Environment",
    "description": "Outstanding environmental work",
    "image": "https://example.com/image.jpg",
    "sdgs": [13],
    "order": 1
  }'
```

**Response:**
```json
{
  "message": "Award created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",  ← Valid MongoDB ObjectId!
    "title": "Excellence Award 2024",
    ...
  }
}
```

---

## 📊 Understanding MongoDB ObjectIds

### What is an ObjectId?
- **Format:** 24 hexadecimal characters
- **Example:** `507f1f77bcf86cd799439011`
- **Generated by:** MongoDB automatically when creating documents
- **Unique:** Globally unique identifier

### Composition:
```
507f1f77bcf86cd799439011
├─────┬─────┼─────┬─────┤
│     │     │     └─── Random counter (3 bytes)
│     │     └───────── Process ID (2 bytes)
│     └─────────────── Machine ID (3 bytes)
└───────────────────── Timestamp (4 bytes)
```

---

## ✅ Verification

After seeding, verify your data:

### 1. Check in MongoDB Compass:
- You should see documents with `_id` fields containing ObjectIds

### 2. Test API:
```bash
# Get all awards (should return real ObjectIds)
curl http://localhost:5000/api/awards
```

### 3. Test with Real ObjectId:
```bash
# Use the ObjectId from the response above
curl http://localhost:5000/api/awards/507f1f77bcf86cd799439011
```

---

## 🚨 Important Notes

### ❌ Don't Use Simple IDs:
```json
{
  "id": "1",      ← ❌ Will cause BSONError
  "id": "2",      ← ❌ Will cause BSONError
  "id": "abc"     ← ❌ Will cause BSONError
}
```

### ✅ Use MongoDB ObjectIds:
```json
{
  "_id": "507f1f77bcf86cd799439011",  ← ✅ Valid
  "_id": "6751a2b3c4d5e6f7a8b9c0d1",  ← ✅ Valid
  "_id": "7862b3c4d5e6f7a8b9c0d1e2"   ← ✅ Valid
}
```

---

## 🎨 Frontend Integration

Once seeded, your frontend will receive real ObjectIds:

```typescript
// Fetch awards from API
const response = await api.getAwards();

// Response contains real MongoDB ObjectIds:
[
  {
    "_id": "507f1f77bcf86cd799439011",  ← Use this ID!
    "title": "Excellence Award 2024",
    ...
  }
]

// Use the real ObjectId for updates/deletes:
await api.updateAward("507f1f77bcf86cd799439011", updatedData); ✅
await api.deleteAward("507f1f77bcf86cd799439011"); ✅
```

---

## 📝 Summary

1. ✅ **Seed your database** using one of the 4 options above
2. ✅ **MongoDB generates ObjectIds** automatically
3. ✅ **Use these ObjectIds** in your API calls
4. ✅ **No more BSONError!** Everything works smoothly

---

**Ready to seed your database! 🌱**

Choose your preferred method and populate your MongoDB with valid data!
