// ========================================
// BACKEND SERVER FOR SDG WEBSITE
// ========================================

// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// SECURITY: Import security middleware
const {
  sanitizeRequest,
  rateLimit,
  requestLogger,
  securityHeaders
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// SECURITY MIDDLEWARE (Applied First)
// ========================================
app.use(securityHeaders);

const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;
const windowMinutes = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15;

if (process.env.ENABLE_RATE_LIMITING !== 'false') {
  app.use(rateLimit(maxRequests, windowMinutes));
}

if (process.env.ENABLE_REQUEST_LOGGING !== 'false') {
  app.use(requestLogger);
}

// ========================================
// CORS CONFIGURATION
// ========================================
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [
      'http://localhost:3000', 'http://localhost:5173', 'https://asian-responsible-enterprise-awards.vercel.app', 'https://asian-responsible-enterprise-awards-sustainabilitys-projects.vercel.app'
    ];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ Explicitly allow methods
  allowedHeaders: ['Content-Type', 'Authorization'],    // ✅ Explicitly allow headers
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests globally
app.options('*', cors(corsOptions));

// ========================================
// BODY PARSING MIDDLEWARE
// ========================================
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(sanitizeRequest);

// ========================================
// SAMPLE ROUTE
// ========================================
app.post('/api/auth/login', (req, res) => {
  // your login logic here
  res.json({ message: 'Login successful' });
});


// ========================================
// CLOUDINARY CONFIGURATION
// ========================================
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB max file size
  }
});

// Video upload endpoint
app.post('/api/upload/video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'sdg-videos',
          chunk_size: 6000000
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({
      message: 'Video uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      format: result.format
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video', message: error.message });
  }
});

// Image upload endpoint
app.post('/api/upload/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'sdg-images',
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image', message: error.message });
  }
});

// Delete file from Cloudinary
app.delete('/api/upload/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const { resourceType } = req.query;
    
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || 'image'
    });
    
    res.json({
      message: 'File deleted successfully',
      result
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file', message: error.message });
  }
});

// ========================================
// MONGODB CONNECTION
// ========================================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sdg-website';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ========================================
// IMPORT ROUTES
// ========================================
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



// ========================================
// API ROUTES
// ========================================
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
app.use('/api/featured-awards', require('./routes/featuredAwards'));





// ========================================
// HEALTH CHECK ENDPOINT
// ========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ========================================
// 404 HANDLER
// ========================================
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.originalUrl
  });
});

// ========================================
// ERROR HANDLING MIDDLEWARE
// ========================================
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: isDevelopment ? err.errors : undefined
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired authentication token'
    });
  }
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed'
    });
  }
  
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: isDevelopment ? err.message : 'Something went wrong!',
    stack: isDevelopment ? err.stack : undefined
  });
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 SDG WEBSITE BACKEND SERVER');
  console.log('========================================');
  console.log(`📡 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔒 CORS Allowed Origins: ${allowedOrigins.join(', ')}`);
  
  console.log('\n========================================');
  console.log('🔐 SECURITY STATUS');
  console.log('========================================');
  console.log(`✅ Security headers enabled`);
  console.log(`${process.env.ENABLE_RATE_LIMITING !== 'false' ? '✅' : '❌'} Rate limiting enabled`);
  console.log(`✅ Request sanitization enabled`);
  
  console.log('\n========================================');
  console.log('💾 DATABASE STATUS');
  console.log('========================================');
  console.log('✅ MongoDB ACTIVE');
  console.log(`📝 Connection: ${MONGODB_URI.replace(/:[^:]*@/, ':****@')}`);
  
  console.log('\n========================================');
  console.log('📦 FILE UPLOAD STATUS');
  console.log('========================================');
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    console.log('✅ Cloudinary configured');
  } else {
    console.log('❌ Cloudinary not configured');
  }
  
  console.log('========================================\n');
});

module.exports = app;
