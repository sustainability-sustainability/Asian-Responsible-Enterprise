# 🚀 Production Deployment Guide

Complete guide to deploying your SDG website to production with MongoDB and Cloudinary.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] All content added and tested locally
- [ ] Images optimized (< 1MB each recommended)
- [ ] SEO metadata configured
- [ ] Mobile responsiveness tested
- [ ] Admin access tested
- [ ] MongoDB Atlas account created
- [ ] Cloudinary account created (for media)
- [ ] Domain name ready (optional)

---

## 🎯 Recommended Stack (Free Tier)

| Service | Purpose | Free Tier | Cost/Month |
|---------|---------|-----------|------------|
| **Vercel** | Frontend hosting | 100GB bandwidth | $0 |
| **Railway** | Backend hosting | 500 hours | $0 |
| **MongoDB Atlas** | Database | 512MB storage | $0 |
| **Cloudinary** | Media storage | 25 credits | $0 |
| **Total** | - | - | **$0** 🎉 |

---

## 🗄️ Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google
4. Verify your email

### 1.2 Create a Cluster

1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a region closest to your users:
   - **Americas:** US East (N. Virginia)
   - **Europe:** Frankfurt
   - **Asia:** Singapore
4. Cluster name: `sdg-website-cluster` (or your choice)
5. Click "Create"

⏱️ **Wait 3-5 minutes** for cluster creation

### 1.3 Create Database User

1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: `sdg-admin` (or your choice)
5. Password: Generate a secure password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### 1.4 Whitelist IP Addresses

1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. For development/testing: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your backend server's IP
5. Click "Confirm"

⚠️ **Security Note:** In production, only whitelist your backend server IP!

### 1.5 Get Connection String

1. Go to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy connection string:
   ```
   mongodb+srv://sdg-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name before `?`:
   ```
   mongodb+srv://sdg-admin:yourpassword@cluster0.xxxxx.mongodb.net/sdg-website?retryWrites=true&w=majority
   ```

✅ **Save this connection string!** You'll need it in the next steps.

---

## 🖼️ Step 2: Cloudinary Setup

### 2.1 Create Cloudinary Account

1. Go to https://cloudinary.com
2. Click "Sign Up for Free"
3. Fill in your details
4. Verify your email

### 2.2 Get API Credentials

1. Go to Dashboard (after login)
2. You'll see your credentials:
   - **Cloud Name:** `your-cloud-name`
   - **API Key:** `123456789012345`
   - **API Secret:** `abc123xyz789` (click eye icon to reveal)
3. Copy all three values

### 2.3 Configure Upload Presets (Optional)

1. Go to Settings → Upload
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Preset name: `sdg-uploads`
5. Signing Mode: **Signed**
6. Folder: `sdg-website`
7. Save

✅ **Save your credentials!** You'll need them in environment variables.

---

## 🎨 Step 3: Backend Deployment (Railway)

### 3.1 Prepare Backend for Deployment

1. **Create production environment file:**

```bash
# In /backend/.env
NODE_ENV=production
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://sdg-admin:yourpassword@cluster0.xxxxx.mongodb.net/sdg-website?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Google OAuth (optional - for admin login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-url.railway.app/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123xyz789

# CORS (will be updated with frontend URL)
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-url.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

2. **Add start script to package.json:**

```json
// backend/package.json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

3. **Commit to Git:**

```bash
git add .
git commit -m "Prepare backend for deployment"
git push origin main
```

### 3.2 Deploy to Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select your repository
6. Railway will detect it's a Node.js project

### 3.3 Configure Railway Environment

1. Go to your project → Variables
2. Add all variables from your `.env` file (click "New Variable"):
   - `NODE_ENV=production`
   - `MONGODB_URI=...` (your full connection string)
   - `JWT_SECRET=...`
   - `CLOUDINARY_CLOUD_NAME=...`
   - `CLOUDINARY_API_KEY=...`
   - `CLOUDINARY_API_SECRET=...`
   - (Add Google OAuth variables if using)

3. Update `ALLOWED_ORIGINS` after frontend deployment

### 3.4 Configure Build Settings

1. Go to Settings
2. **Root Directory:** `/backend` (if backend is in subdirectory)
3. **Start Command:** `node server.js`
4. Click "Deploy"

### 3.5 Get Backend URL

1. Go to Settings → Domains
2. Railway will generate a URL: `your-app.railway.app`
3. Or add custom domain: Click "Add Domain"

✅ **Save your backend URL!** Format: `https://your-app.railway.app`

### 3.6 Test Backend

```bash
# Test health endpoint
curl https://your-app.railway.app/health

# Should return:
{"status":"ok","mongodb":"connected"}
```

---

## 🌐 Step 4: Frontend Deployment (Vercel)

### 4.1 Prepare Frontend for Deployment

1. **Create environment file:**

```bash
# In /.env.production
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

2. **Update vite.config.ts** (if needed):

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable for production
  },
});
```

3. **Commit to Git:**

```bash
git add .
git commit -m "Prepare frontend for deployment"
git push origin main
```

### 4.2 Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your Git repository
4. Vercel will auto-detect Vite

**Configure Build Settings:**
- **Framework Preset:** Vite
- **Root Directory:** `./` (or empty if root)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

**Add Environment Variables:**
1. Click "Environment Variables"
2. Add:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app/api`
   - Key: `VITE_GOOGLE_CLIENT_ID`
   - Value: Your Google Client ID (if using OAuth)

3. Click "Deploy"

⏱️ **Wait 2-3 minutes** for deployment

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts to configure
```

### 4.3 Get Frontend URL

Vercel will provide:
- **Production URL:** `https://your-project.vercel.app`
- **Custom Domain:** Can add in Settings → Domains

### 4.4 Update Backend CORS

Now that you have your frontend URL, update backend:

1. Go to Railway → Your Project → Variables
2. Update `ALLOWED_ORIGINS`:
   ```
   https://your-project.vercel.app,https://www.yourdomain.com
   ```
3. Redeploy backend (Railway auto-redeploys)

---

## 🔐 Step 5: Google OAuth Configuration

### 5.1 Update Google Cloud Console

1. Go to https://console.cloud.google.com
2. Select your project
3. Go to "Credentials"
4. Edit your OAuth 2.0 Client ID
5. **Authorized JavaScript origins:**
   - Add: `https://your-project.vercel.app`
   - Add: `https://your-backend.railway.app`
6. **Authorized redirect URIs:**
   - Add: `https://your-backend.railway.app/api/auth/google/callback`
7. Save

### 5.2 Test OAuth Login

1. Go to your live website
2. Click logo 5 times
3. Click "Login with Google"
4. Should redirect to Google login
5. After auth, redirects back with success

---

## 🔧 Step 6: Activate MongoDB in Production

Your backend is now using MongoDB! Test it:

1. Go to your website
2. Access admin dashboard (bypass or Google OAuth)
3. Add/edit some content
4. Check MongoDB Atlas → Browse Collections
5. You should see your data! 🎉

### Verify Data in MongoDB

1. Go to MongoDB Atlas → Database → Browse Collections
2. You should see collections:
   - `homes`
   - `awards`
   - `missions`
   - `news`
   - `events`
   - `publications`
   - `communities`
   - `contacts`
   - `themes`

---

## 🎯 Step 7: Configure Custom Domain (Optional)

### For Frontend (Vercel)

1. Buy domain from Namecheap, GoDaddy, etc.
2. Go to Vercel → Your Project → Settings → Domains
3. Click "Add Domain"
4. Enter: `yourdomain.com`
5. Follow DNS configuration instructions:
   - **A Record:** Point to Vercel's IP
   - **CNAME Record:** Point `www` to `cname.vercel-dns.com`
6. Wait for DNS propagation (5-60 minutes)

### For Backend (Railway)

1. Go to Railway → Settings → Domains
2. Click "Add Domain"
3. Enter: `api.yourdomain.com`
4. Add CNAME record at your domain registrar:
   - Host: `api`
   - Value: Your Railway domain
5. Wait for verification

### Update Environment Variables

After custom domains are set up:

**Backend:**
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/api/auth/google/callback
```

**Frontend:**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

**Google OAuth:**
- Update redirect URIs to use `api.yourdomain.com`

---

## 📊 Step 8: Monitoring & Analytics

### 8.1 Error Tracking (Sentry) - Optional

```bash
npm install @sentry/react @sentry/tracing

# Add to App.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### 8.2 Analytics (Google Analytics) - Optional

```tsx
// Add to /index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 8.3 Uptime Monitoring

- **UptimeRobot** (free): https://uptimerobot.com
- **Pingdom** (free trial): https://www.pingdom.com

Set up monitors for:
- Frontend: `https://yourdomain.com`
- Backend health: `https://your-backend.railway.app/health`

---

## 🔒 Step 9: Security Hardening

### 9.1 Environment Variables Security

✅ **Do:**
- Use strong, random secrets (min 32 characters)
- Different secrets for dev/staging/production
- Rotate secrets regularly

❌ **Don't:**
- Commit `.env` files to Git
- Share secrets in plain text
- Reuse secrets across projects

### 9.2 MongoDB Security

1. **Network Access:**
   - Remove 0.0.0.0/0 (allow all)
   - Add only backend server IP

2. **Database Access:**
   - Use read-only users for analytics
   - Use different users for different services

3. **Connection String:**
   - Use SRV connection string
   - Enable TLS/SSL
   - Use strong password

### 9.3 API Security

Already implemented in your backend:
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Input validation
- ✅ Secure headers

### 9.4 Cloudinary Security

1. **Signed Uploads:**
   - Use signed mode for production
   - Don't expose API secret in frontend

2. **Upload Restrictions:**
   - Set max file size limits
   - Restrict allowed formats
   - Use folders for organization

---

## 🧪 Step 10: Testing Production

### 10.1 Functionality Tests

- [ ] Homepage loads correctly
- [ ] All sections display properly
- [ ] Dark/light mode works
- [ ] Mobile responsive
- [ ] Images load from Cloudinary
- [ ] Admin login works (both methods)
- [ ] CRUD operations work in dashboard
- [ ] Data persists across sessions
- [ ] SEO meta tags present

### 10.2 Performance Tests

Use Lighthouse (Chrome DevTools):

```bash
# Or use CLI
npm install -g lighthouse
lighthouse https://yourdomain.com --view
```

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### 10.3 Load Testing

Use Artillery:

```bash
npm install -g artillery

# Create test-load.yml
artillery quick --duration 60 --rate 10 https://yourdomain.com
```

### 10.4 Cross-Browser Testing

Test on:
- [ ] Chrome (Windows/Mac)
- [ ] Firefox (Windows/Mac)
- [ ] Safari (Mac)
- [ ] Edge (Windows)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 📈 Step 11: SEO Setup

### 11.1 Google Search Console

1. Go to https://search.google.com/search-console
2. Add property: `https://yourdomain.com`
3. Verify ownership (use DNS or file upload)
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

### 11.2 Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters
2. Add site: `https://yourdomain.com`
3. Submit sitemap

### 11.3 Schema Markup

Already included in your SEO component! Verify:
- https://search.google.com/test/rich-results
- Enter your URL
- Should show Organization schema

### 11.4 Social Media Optimization

Test your Open Graph tags:
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/

---

## 🔄 Step 12: Continuous Deployment

### Set Up Auto-Deploy

**Vercel** (Frontend):
- Automatically deploys on `git push`
- Push to `main` branch → Production
- Push to other branches → Preview deployments

**Railway** (Backend):
- Automatically deploys on `git push`
- Can set up deploy hooks
- Manual deploy button available

### Git Workflow

```bash
# Development
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "Add new feature"
git push origin feature/new-feature

# Create Pull Request on GitHub
# After review and merge to main:
# → Auto-deploys to production! 🎉
```

---

## 💾 Step 13: Backup Strategy

### Database Backups

**MongoDB Atlas:**
- Automatic daily backups (free tier)
- Point-in-time recovery (paid)
- Manual snapshots available

**Manual Backup:**
```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/sdg-website"
```

### Media Backups

**Cloudinary:**
- Files stored permanently
- Download via admin panel or API
- Keep local copies of source files

### Code Backups

**Git:**
- Code already backed up in Git
- Use GitHub/GitLab/Bitbucket
- Keep redundant remotes

---

## 🎉 Launch Checklist

Before announcing your site:

- [ ] All content finalized and proofread
- [ ] All images optimized (< 1MB)
- [ ] All links working (internal and external)
- [ ] Contact form tested and working
- [ ] SEO metadata complete for all pages
- [ ] Social sharing images configured
- [ ] Mobile experience tested thoroughly
- [ ] Load testing passed
- [ ] Security scan completed
- [ ] Backup system verified
- [ ] Analytics tracking confirmed
- [ ] Custom domain configured
- [ ] SSL certificate active (https)
- [ ] Admin access secured
- [ ] Monitoring alerts set up
- [ ] Error tracking configured

---

## 📞 Post-Launch

### Week 1
- Monitor error logs daily
- Check analytics for traffic patterns
- Test all functionality from real users
- Collect initial feedback
- Fix any reported issues

### Month 1
- Review performance metrics
- Optimize slow pages
- Update content regularly
- Build SEO presence
- Set up regular content calendar

### Ongoing
- Weekly content updates
- Monthly performance review
- Quarterly security audit
- Regular backups verification
- Feature improvements based on feedback

---

## 🆘 Troubleshooting

### Issue: Site won't load after deployment
**Check:**
- Build logs in Vercel (look for errors)
- Environment variables are set correctly
- VITE_API_URL is correct with `/api` at end

### Issue: API calls failing
**Check:**
- Backend is running (check Railway logs)
- CORS is configured with frontend URL
- MongoDB connection is working
- API URL in frontend has `/api` suffix

### Issue: Images not loading
**Check:**
- Cloudinary credentials in backend .env
- Files uploaded successfully
- Browser console for errors
- Cloudinary CDN status

### Issue: MongoDB connection failed
**Check:**
- Connection string format is correct
- Password doesn't contain special characters (URL encode if needed)
- IP whitelist includes backend server
- Network access is configured

### Issue: Google OAuth not working
**Check:**
- Redirect URIs match exactly (including https://)
- Client ID/Secret are correct
- OAuth consent screen is configured
- Credentials are in production .env

---

## 📊 Cost Estimate

### Free Tier Limits

**Vercel:**
- 100GB bandwidth/month
- Unlimited personal projects
- 100 deployments/day

**Railway:**
- $5 free credit/month
- ~500 execution hours

**MongoDB Atlas:**
- 512MB storage
- Shared CPU/RAM
- Perfect for small-medium sites

**Cloudinary:**
- 25 credits/month
- 25GB storage
- 25GB bandwidth

### When You Outgrow Free Tier

**Vercel Pro:** $20/month
- 1TB bandwidth
- Advanced analytics

**Railway:** ~$5-20/month
- Pay for actual usage
- No free tier limits

**MongoDB Atlas:** $9/month (M2)
- 2GB storage
- Dedicated resources

**Cloudinary:** $89/month
- 2,000 credits
- 101GB storage

**Total (paid):** ~$30-50/month for medium traffic site

---

## 🎓 Additional Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas)
- [Cloudinary Docs](https://cloudinary.com/documentation)

### Tutorials
- [Deploy React to Vercel](https://vercel.com/guides/deploying-react-with-vercel)
- [Deploy Node.js to Railway](https://docs.railway.app/deploy/deployments)
- [MongoDB Atlas Setup](https://www.mongodb.com/basics/mongodb-atlas-tutorial)

### Support
- Vercel: https://vercel.com/support
- Railway: https://railway.app/help
- MongoDB: https://www.mongodb.com/community/forums

---

## ✅ Success!

Your SDG website is now live in production! 🎉

You have:
- ✅ Frontend deployed to Vercel
- ✅ Backend deployed to Railway
- ✅ MongoDB Atlas database
- ✅ Cloudinary media storage
- ✅ SSL/HTTPS enabled
- ✅ Custom domain (optional)
- ✅ Monitoring set up
- ✅ Backups configured

**Share your website with the world!** 🌍💚

---

**Questions?** Check the other documentation files or review the code comments.

**Last Updated:** December 14, 2024  
**Status:** Production Ready ✅
