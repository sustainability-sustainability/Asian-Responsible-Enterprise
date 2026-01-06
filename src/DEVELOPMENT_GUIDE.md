# 💻 Development Guide

Complete guide for developers working on the SDG website codebase.

---

## 📚 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Tech Stack](#tech-stack)
4. [Development Setup](#development-setup)
5. [Component Guide](#component-guide)
6. [Adding New Features](#adding-new-features)
7. [API Integration](#api-integration)
8. [Styling Guide](#styling-guide)
9. [State Management](#state-management)
10. [Best Practices](#best-practices)
11. [Testing](#testing)
12. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐ │
│  │   App    │  │Components│  │   Dashboard (Admin)   │ │
│  │Navigation│  │ 8 Sections│  │   CRUD Operations     │ │
│  │Dark/Light│  │17 SDGs   │  │   Theme Management    │ │
│  └──────────┘  └──────────┘  └───────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST API
                       ↓
┌─────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Routes  │  │ Models   │  │Middleware│             │
│  │  /api/*  │  │ Mongoose │  │ Security │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │                           │
         ↓                           ↓
┌──────────────────┐       ┌──────────────────┐
│  MongoDB Atlas   │       │   Cloudinary     │
│   (Database)     │       │  (Media CDN)     │
└──────────────────┘       └──────────────────┘
```

---

## 📁 Project Structure

```
sdg-website/
├── App.tsx                      # Main application entry point
├── package.json                 # Frontend dependencies
│
├── components/                  # React components
│   ├── Home.tsx                 # Home section
│   ├── Awards.tsx               # Awards section
│   ├── Mission.tsx              # Mission section
│   ├── News.tsx                 # News section with articles
│   ├── Events.tsx               # Events calendar
│   ├── Publications.tsx         # Publications library
│   ├── Community.tsx            # Community members
│   ├── Contact.tsx              # Contact information
│   ├── Dashboard.tsx            # Admin dashboard main
│   ├── AuthModal.tsx            # Login modal
│   ├── SEO.tsx                  # SEO component
│   ├── SDGGrid.tsx              # SDG grid display
│   ├── EventCalendar.tsx        # Calendar widget
│   │
│   ├── dashboard/               # Dashboard sub-components
│   │   ├── DashboardHome.tsx
│   │   ├── DashboardAwards.tsx
│   │   ├── DashboardMission.tsx
│   │   ├── DashboardNews.tsx
│   │   ├── DashboardEvents.tsx
│   │   ├── DashboardPublications.tsx
│   │   ├── DashboardCommunity.tsx
│   │   ├── DashboardContact.tsx
│   │   ├── DashboardSEO.tsx
│   │   ├── DashboardTheme.tsx
│   │   └── FileUpload.tsx       # Reusable file upload
│   │
│   ├── ui/                      # UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── ... (30+ components)
│   │   └── utils.ts             # cn() utility
│   │
│   └── figma/                   # Protected Figma components
│       └── ImageWithFallback.tsx
│
├── styles/                      # Styles
│   └── globals.css              # Tailwind + custom CSS
│
├── utils/                       # Utilities
│   └── api.ts                   # Centralized API client
│
├── public/                      # Static files
│   ├── sitemap.xml              # SEO sitemap
│   └── robots.txt               # SEO robots
│
├── backend/                     # Express backend
│   ├── server.js                # Main server file
│   ├── package.json             # Backend dependencies
│   ├── .env                     # Environment variables (not in git)
│   │
│   ├── models/                  # MongoDB schemas
│   │   ├── Home.js
│   │   ├── Award.js
│   │   ├── Mission.js
│   │   ├── News.js
│   │   ├── Event.js
│   │   ├── Publication.js
│   │   ├── Community.js
│   │   ├── Contact.js
│   │   ├── Theme.js
│   │   └── User.js
│   │
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication
│   │   ├── home.js              # Home CRUD
│   │   ├── awards.js            # Awards CRUD
│   │   ├── mission.js           # Mission CRUD
│   │   ├── news.js              # News CRUD
│   │   ├── events.js            # Events CRUD
│   │   ├── publications.js      # Publications CRUD
│   │   ├── community.js         # Community CRUD
│   │   ├── contact.js           # Contact CRUD
│   │   └── theme.js             # Theme CRUD
│   │
│   └── middleware/              # Express middleware
│       └── security.js          # Security middleware
│
└── [documentation files]        # This and other MD files
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 5.x | Build tool |
| **Tailwind CSS** | 4.x | Styling |
| **Motion (Framer Motion)** | 11.x | Animations |
| **Lucide React** | Latest | Icons |
| **Recharts** | 2.x | Charts |
| **shadcn/ui** | Latest | UI components |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime |
| **Express** | 4.x | Web framework |
| **MongoDB** | 6.x | Database |
| **Mongoose** | 8.x | ODM |
| **Passport** | Latest | Authentication |
| **Multer** | Latest | File uploads |
| **Cloudinary** | Latest | Media storage |

---

## ⚙️ Development Setup

### Prerequisites

```bash
node --version  # v18 or higher
npm --version   # v9 or higher
```

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/sdg-website.git
cd sdg-website

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Environment Configuration

**Frontend:** Create `/.env.development`
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

**Backend:** Create `/backend/.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sdg-website
JWT_SECRET=dev-secret-key-change-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Running Development Servers

```bash
# Terminal 1: Frontend
npm run dev
# Runs on http://localhost:5173

# Terminal 2: Backend
cd backend
npm run dev
# Runs on http://localhost:5000
```

---

## 🧩 Component Guide

### Public Components (8 Sections)

#### Home.tsx
```tsx
// Purpose: Landing page with hero section
// Features:
// - Hero image and title
// - SDG highlights
// - Call-to-action buttons
// - Statistics display

// Data structure:
interface HomeData {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  sdgHighlights: Array<{
    id: number;
    title: string;
    description: string;
  }>;
}
```

#### News.tsx
```tsx
// Purpose: News articles with magazine layout
// Features:
// - Featured article (large card)
// - Grid of news articles
// - Category filtering
// - Read more links

// Data structure:
interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
}
```

#### Events.tsx
```tsx
// Purpose: Events calendar and listings
// Features:
// - Calendar view
// - List view
// - Event filtering by date/category
// - Photo galleries
// - Registration links

// Data structure:
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  image: string;
  gallery: string[];
  category: string;
  registrationLink?: string;
}
```

### Dashboard Components

#### DashboardHome.tsx
```tsx
// Purpose: Edit home page content
// Features:
// - Hero section editor
// - SDG highlights CRUD
// - Image uploader
// - Preview mode

// Usage:
<DashboardHome />
```

#### FileUpload.tsx
```tsx
// Purpose: Reusable file upload component
// Features:
// - Drag and drop
// - File size detection
// - Auto Cloudinary for large files
// - Progress indicator
// - Preview

// Usage:
<FileUpload
  onUpload={(url) => setImageUrl(url)}
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
/>
```

---

## ➕ Adding New Features

### Example: Adding a "Team" Section

#### Step 1: Create Component

```tsx
// components/Team.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string;
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    // Load from localStorage or API
    const stored = localStorage.getItem('team');
    if (stored) {
      setTeamMembers(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl mb-8">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <motion.div
            key={member.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl mb-2">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
            <p className="mt-4">{member.bio}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

#### Step 2: Create Dashboard Editor

```tsx
// components/dashboard/DashboardTeam.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import FileUpload from './FileUpload';
import { Plus, Trash2, Save } from 'lucide-react';

export default function DashboardTeam() {
  const [members, setMembers] = useState([]);

  const addMember = () => {
    setMembers([
      ...members,
      {
        id: Date.now().toString(),
        name: '',
        role: '',
        bio: '',
        image: '',
        email: '',
      },
    ]);
  };

  const updateMember = (id, field, value) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const deleteMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const save = () => {
    localStorage.setItem('team', JSON.stringify(members));
    // Or API call: await api.team.saveAll(members);
    alert('Team saved!');
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl">Manage Team</h2>
        <Button onClick={addMember}>
          <Plus className="mr-2" /> Add Member
        </Button>
      </div>

      {members.map((member) => (
        <div key={member.id} className="border rounded-lg p-4 mb-4">
          <Input
            placeholder="Name"
            value={member.name}
            onChange={(e) => updateMember(member.id, 'name', e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Role"
            value={member.role}
            onChange={(e) => updateMember(member.id, 'role', e.target.value)}
            className="mb-2"
          />
          <Textarea
            placeholder="Bio"
            value={member.bio}
            onChange={(e) => updateMember(member.id, 'bio', e.target.value)}
            className="mb-2"
          />
          <FileUpload
            onUpload={(url) => updateMember(member.id, 'image', url)}
            accept="image/*"
          />
          <Button
            variant="destructive"
            onClick={() => deleteMember(member.id)}
            className="mt-2"
          >
            <Trash2 className="mr-2" /> Delete
          </Button>
        </div>
      ))}

      <Button onClick={save} className="mt-4">
        <Save className="mr-2" /> Save All
      </Button>
    </div>
  );
}
```

#### Step 3: Add to Navigation

```tsx
// App.tsx
import Team from './components/Team';

const navItems = [
  // ... existing items
  { id: 'team', label: 'Team', component: Team },
];
```

#### Step 4: Add to Dashboard

```tsx
// components/Dashboard.tsx
import DashboardTeam from './dashboard/DashboardTeam';

const dashboardSections = [
  // ... existing sections
  { id: 'team', label: 'Team', component: DashboardTeam },
];
```

#### Step 5: Create Backend Model (Optional)

```javascript
// backend/models/Team.js
const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  email: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
```

#### Step 6: Create Backend Routes (Optional)

```javascript
// backend/routes/team.js
const express = require('express');
const router = express.Router();
const TeamMember = require('../models/Team');

// Get all team members
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create team member
router.post('/', async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update team member
router.put('/:id', async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete team member
router.delete('/:id', async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### Step 7: Register Route

```javascript
// backend/server.js
const teamRoutes = require('./routes/team');
app.use('/api/team', teamRoutes);
```

#### Step 8: Add API Helper

```typescript
// utils/api.ts
export const api = {
  // ... existing methods
  team: {
    getAll: () => apiRequest('/team'),
    create: (data) => apiRequest('/team', 'POST', data),
    update: (id, data) => apiRequest(`/team/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/team/${id}`, 'DELETE'),
  },
};
```

---

## 🌐 API Integration

### API Client (utils/api.ts)

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function apiRequest(
  endpoint: string,
  method: string = 'GET',
  data?: any
) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  home: {
    get: () => apiRequest('/home'),
    update: (data) => apiRequest('/home', 'PUT', data),
  },
  news: {
    getAll: () => apiRequest('/news'),
    getOne: (id) => apiRequest(`/news/${id}`),
    create: (data) => apiRequest('/news', 'POST', data),
    update: (id, data) => apiRequest(`/news/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/news/${id}`, 'DELETE'),
  },
  // ... more sections
};
```

### Using the API

```tsx
// In a component
import { api } from '../utils/api';

function NewsComponent() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await api.news.getAll();
      setNews(data);
    } catch (error) {
      console.error('Failed to load news:', error);
    }
  };

  const createArticle = async (articleData) => {
    try {
      await api.news.create(articleData);
      await loadNews(); // Reload list
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };

  return (/* ... */);
}
```

---

## 🎨 Styling Guide

### Tailwind CSS

**DO:**
```tsx
// Use semantic utility classes
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
  <h2 className="text-primary-gold mb-4">Title</h2>
</div>
```

**DON'T:**
```tsx
// Don't override default typography (already set in globals.css)
<h2 className="text-2xl font-bold">Title</h2>

// Unless specifically requested by user!
```

### Custom Colors

```css
/* styles/globals.css */
:root {
  --primary-gold: #fbbf24;
  --primary-yellow: #fef3c7;
  --primary-blue: #3b82f6;
  --light-blue: #93c5fd;
  --primary-green: #10b981;
  --dark-green: #047857;
}

/* Use in components */
.custom-class {
  background-color: var(--primary-gold);
}
```

### Responsive Design

```tsx
// Mobile-first approach
<div className="
  grid
  grid-cols-1          // Mobile: 1 column
  md:grid-cols-2       // Tablet: 2 columns
  lg:grid-cols-3       // Desktop: 3 columns
  gap-4                // Consistent gap
">
  {/* Content */}
</div>
```

### Dark Mode

```tsx
// Automatic dark mode support
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Content adapts to theme */}
</div>
```

---

## 🔄 State Management

### Local State (useState)

```tsx
// For component-specific state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });
```

### Persistent State (localStorage)

```tsx
// Initialize from localStorage
const [theme, setTheme] = useState(() => {
  const saved = localStorage.getItem('theme');
  return saved || 'light';
});

// Save to localStorage on change
useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);
```

### Global State (Context) - Future Enhancement

```tsx
// Create context
const AppContext = createContext();

// Provider
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

// Use in components
const { user, theme } = useContext(AppContext);
```

---

## ✅ Best Practices

### Component Structure

```tsx
// 1. Imports
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';

// 2. Types/Interfaces
interface Props {
  title: string;
  onSave: (data: any) => void;
}

// 3. Component
export default function MyComponent({ title, onSave }: Props) {
  // 4. State
  const [data, setData] = useState([]);

  // 5. Effects
  useEffect(() => {
    loadData();
  }, []);

  // 6. Functions
  const loadData = async () => {
    // ...
  };

  const handleSave = () => {
    onSave(data);
  };

  // 7. Render
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### Error Handling

```tsx
try {
  await api.news.create(data);
  toast.success('Article created!');
} catch (error) {
  console.error('Failed to create article:', error);
  toast.error('Failed to create article. Please try again.');
}
```

### Code Organization

```
components/
├── Feature/                    # Group related components
│   ├── FeatureList.tsx
│   ├── FeatureItem.tsx
│   ├── FeatureForm.tsx
│   └── types.ts               # Shared types
└── shared/                    # Shared utilities
    ├── hooks/
    ├── utils/
    └── constants.ts
```

---

## 🧪 Testing

### Manual Testing Checklist

**Frontend:**
- [ ] All sections load without errors
- [ ] Navigation works correctly
- [ ] Dark/light mode switches properly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Images load correctly
- [ ] Forms validate input
- [ ] Admin login works (both methods)
- [ ] Dashboard CRUD operations work

**Backend:**
- [ ] All API endpoints respond
- [ ] MongoDB connection works
- [ ] CORS allows frontend requests
- [ ] File uploads work
- [ ] Authentication works
- [ ] Error handling works

### Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

### Performance Testing

```bash
# Lighthouse
npx lighthouse http://localhost:5173 --view

# Bundle size
npm run build
ls -lh dist/
```

---

## 🐛 Troubleshooting

### Common Development Issues

**Issue: Hot reload not working**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

**Issue: TypeScript errors**
```bash
# Regenerate types
npm run type-check
```

**Issue: Styles not applying**
```bash
# Check Tailwind is watching
# Verify globals.css is imported in App.tsx
```

**Issue: API calls failing**
```bash
# Check backend is running
curl http://localhost:5000/health

# Check CORS
console.log(import.meta.env.VITE_API_URL)
```

---

## 📚 Additional Resources

### Official Docs
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Motion](https://motion.dev)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com/docs)

### Learning Resources
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)
- [Tailwind Components](https://tailwindui.com/components)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🎯 Next Steps

After mastering the basics:
1. Add automated tests (Jest + React Testing Library)
2. Set up CI/CD pipeline
3. Implement advanced features
4. Optimize performance
5. Enhance accessibility (WCAG compliance)

---

**Happy coding!** 🚀

Last Updated: December 14, 2024
