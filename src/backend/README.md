# 🔧 SDG Website Backend

Express.js API server with MongoDB, authentication, and file uploads.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Start server
npm run dev  # Development with hot-reload
npm start    # Production
```

Server runs on: `http://localhost:5000`

---

## 🏗️ Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Passport.js** - Authentication
- **Multer** - File uploads
- **Cloudinary** - Media storage
- **JWT** - Token authentication

---

## 📁 Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example          # Environment template
├── .env                  # Your config (not in git)
│
├── models/               # MongoDB schemas
│   ├── Home.js
│   ├── Award.js
│   ├── Mission.js
│   ├── News.js
│   ├── Event.js
│   ├── Publication.js
│   ├── Community.js
│   ├── Contact.js
│   ├── Theme.js
│   └── User.js
│
├── routes/               # API endpoints
│   ├── auth.js           # Authentication
│   ├── home.js           # Home CRUD
│   ├── awards.js         # Awards CRUD
│   ├── mission.js        # Mission CRUD
│   ├── news.js           # News CRUD
│   ├── events.js         # Events CRUD
│   ├── publications.js   # Publications CRUD
│   ├── community.js      # Community CRUD
│   ├── contact.js        # Contact CRUD
│   └── theme.js          # Theme CRUD
│
└── middleware/
    └── security.js       # Security middleware
```

---

## 🔐 Environment Variables

See `.env.example` for all available options. Required variables:

```env
MONGODB_URI=mongodb://localhost:27017/sdg-website
JWT_SECRET=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:5173
```

Optional but recommended for production:
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 📡 API Endpoints

See `/API_REFERENCE.md` in the root directory for complete documentation.

**Base URL:** `http://localhost:5000/api`

### Main Endpoints

- `GET /health` - Health check
- `POST /auth/google` - Google OAuth login
- `GET /home` - Get home data
- `PUT /home` - Update home data
- `GET /news` - Get all news
- `POST /news` - Create news article
- `GET /events` - Get all events
- `POST /events` - Create event
- `GET /publications` - Get publications
- `POST /publications` - Create publication
- `POST /upload` - Upload file to Cloudinary

---

## 🗄️ Database

### MongoDB Atlas (Recommended)

1. Create account: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to `.env`:
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sdg-website
   ```

### Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use local connection:
   ```env
   MONGODB_URI=mongodb://localhost:27017/sdg-website
   ```

### Collections Created

- `homes` - Home page content
- `awards` - Awards list
- `missions` - Mission content
- `news` - News articles
- `events` - Events calendar
- `publications` - Publications library
- `communities` - Community members
- `contacts` - Contact information
- `themes` - Theme settings
- `users` - Admin users

---

## 🔐 Authentication

### Google OAuth (Recommended)

1. Go to: https://console.cloud.google.com
2. Create project and OAuth credentials
3. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
4. Add credentials to `.env`

### Testing/Development

Use the bypass authentication method in the frontend (no backend setup required).

---

## 🖼️ File Uploads

### Cloudinary Setup (For Large Files)

1. Create account: https://cloudinary.com
2. Get credentials from dashboard
3. Add to `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

### Without Cloudinary

Small files (< 5MB) are stored as base64 strings in MongoDB. No additional setup needed.

---

## 🔒 Security Features

Implemented security measures:

- ✅ Rate limiting (100 req/15min)
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Input validation
- ✅ XSS prevention
- ✅ MongoDB injection prevention
- ✅ JWT authentication
- ✅ Secure session handling

See `SECURITY_GUIDE.md` for details.

---

## 🧪 Testing

### Test MongoDB Connection

```bash
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected!')).catch(e => console.error('❌', e));"
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Get news
curl http://localhost:5000/api/news

# Create news (requires authentication)
curl -X POST http://localhost:5000/api/news \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content"}'
```

---

## 🚀 Deployment

### Railway (Recommended)

1. Push code to GitHub
2. Go to railway.app
3. "New Project" → "Deploy from GitHub"
4. Select repository
5. Add environment variables
6. Deploy!

### Heroku

```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your-connection-string
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

### Render

1. Create new Web Service
2. Connect GitHub repository
3. Set environment variables
4. Deploy

---

## 📊 Monitoring

### Logs

```bash
# Development
npm run dev  # Shows logs in terminal

# Production (PM2)
npm install -g pm2
pm2 start server.js --name sdg-api
pm2 logs sdg-api
pm2 monit
```

### Health Endpoint

Monitor: `GET /health`

Returns:
```json
{
  "status": "ok",
  "mongodb": "connected",
  "uptime": 123456
}
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

### MongoDB Connection Failed

- Check connection string format
- Verify username/password
- Check network access (whitelist IP in MongoDB Atlas)
- Ensure MongoDB is running (local)

### CORS Errors

- Add frontend URL to `ALLOWED_ORIGINS` in `.env`
- Format: `http://localhost:5173,https://yourdomain.com`
- No trailing slashes

### File Upload Fails

- Check Cloudinary credentials
- Verify file size < 10MB (or configure limits)
- Check network connection

---

## 📚 Documentation

- **Main README**: `/README.md` - Project overview
- **Quick Start**: `/QUICK_START.md` - Get started in 5 minutes
- **Deployment**: `/DEPLOYMENT_GUIDE.md` - Production deployment
- **Development**: `/DEVELOPMENT_GUIDE.md` - Code guide for developers
- **API Reference**: `/API_REFERENCE.md` - Complete API documentation
- **Security**: `/backend/SECURITY_GUIDE.md` - Security best practices

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

---

## 📝 Notes

- Never commit `.env` file
- Use strong secrets in production
- Enable all security features
- Monitor logs regularly
- Keep dependencies updated
- Backup database regularly

---

**Last Updated:** December 14, 2024  
**Version:** 2.0.0  
**Status:** Production Ready ✅
